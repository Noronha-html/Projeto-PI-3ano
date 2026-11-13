  import { useCallback, useEffect, useRef, useState } from "react";

  import { buscarLeituras, salvarLeitura } from "../api/api";

  export interface LeituraAgua {
    nivel: number;
    timestamp: number;
  }

  const INTERVALO_GRAFICO_MS = 1500;

  const MUDANCA_BRUSCA_CM = 0.2;

  const MAX_LEITURAS_GRAFICO = 30;

  const FILTROS_ARDUINO = [
    { usbVendorId: 0x2341 },
    { usbVendorId: 0x1a86 },
    { usbVendorId: 0x0403 },
    { usbVendorId: 0x10c4 },
  ];

  export function useSerial() {

    const [conectado, setConectado] = useState(false);
    const [nivel, setNivel] = useState<number | null>(null);
    const [leituras, setLeituras] = useState<LeituraAgua[]>([]);
    const [totalLeituras, setTotalLeituras] = useState(0);
    const [erro, setErro] = useState<string | null>(null);


    const portRef = useRef<SerialPort | null>(null);
    const readerRef =
      useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
    const decoderRef = useRef(new TextDecoder());

    const nivelAtualRef = useRef<number | null>(null);
    const ultimaLeituraGraficoRef = useRef<LeituraAgua | null>(null);

    const graficoAtivoRef = useRef(false);
    const intervaloGraficoRef = useRef<number | null>(null);
    const intervaloSimulacaoRef = useRef<number | null>(null);

    const abrindoRef = useRef(false);

    useEffect(() => {
      let cancelado = false;

      async function carregarHistorico() {
        try {
          const registros = await buscarLeituras();

          if (cancelado) return;

          const historico: LeituraAgua[] = registros
            .map((registro) => ({
              nivel: Number(registro.nivel),
              timestamp: new Date(registro.criadoEm).getTime(),
            }))
            .filter(
              (leitura) =>
                Number.isFinite(leitura.timestamp) &&
                Number.isFinite(leitura.nivel)
            )
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-MAX_LEITURAS_GRAFICO);

          if (historico.length === 0) return;

          const ultimaHistorica = historico[historico.length - 1];

          if (nivelAtualRef.current === null) {
            nivelAtualRef.current = ultimaHistorica.nivel;
            setNivel(ultimaHistorica.nivel);
          }

          const ultimaExistente = ultimaLeituraGraficoRef.current;

          if (
            ultimaExistente === null ||
            ultimaHistorica.timestamp > ultimaExistente.timestamp
          ) {
            ultimaLeituraGraficoRef.current = ultimaHistorica;
          }

          setLeituras((atuais) => {
            const porTimestamp = new Map<number, LeituraAgua>();

            for (const leitura of [...historico, ...atuais]) {
              porTimestamp.set(leitura.timestamp, leitura);
            }

            return [...porTimestamp.values()]
              .sort((a, b) => a.timestamp - b.timestamp)
              .slice(-MAX_LEITURAS_GRAFICO);
          });
        } catch (error) {
          if (cancelado) return;

          console.error("Erro ao carregar histórico:", error);
          setErro("Não foi possível carregar o histórico do servidor.");
        }
      }

      void carregarHistorico();

      return () => {
        cancelado = true;
      };
    }, []);

    const adicionarPontoGrafico = useCallback(() => {
      if (!graficoAtivoRef.current) return;

      const nivelAtual = nivelAtualRef.current;

      if (nivelAtual === null) return;

      const novaLeitura: LeituraAgua = {
        nivel: nivelAtual,
        timestamp: Date.now(),
      };

      ultimaLeituraGraficoRef.current = novaLeitura;

      setLeituras((atuais) =>
        [...atuais, novaLeitura].slice(-MAX_LEITURAS_GRAFICO)
      );
      void salvarLeitura(nivelAtual).catch((error) => {
        console.error("Erro ao salvar no MongoDB:", error);
        setErro("Não foi possível salvar uma leitura no servidor.");
      });
    }, []);

    const iniciarGrafico = useCallback(() => {
      if (intervaloGraficoRef.current !== null) return;

      graficoAtivoRef.current = true;

      intervaloGraficoRef.current = window.setInterval(
        adicionarPontoGrafico,
        INTERVALO_GRAFICO_MS
      );
    }, [adicionarPontoGrafico]);

    const pararGrafico = useCallback(() => {
      graficoAtivoRef.current = false;

      if (intervaloGraficoRef.current !== null) {
        clearInterval(intervaloGraficoRef.current);
        intervaloGraficoRef.current = null;
      }
    }, []);

    const processarLinha = useCallback(
      (linha: string) => {
        const texto = linha.trim();

        if (!texto) return;

        try {
          const dados = JSON.parse(texto);

          if (
            typeof dados.nivel !== "number" ||
            !Number.isFinite(dados.nivel)
          ) {
            console.warn("Leitura inválida:", dados);
            return;
          }

          const novoNivel = dados.nivel;

          nivelAtualRef.current = novoNivel;
          setNivel(novoNivel);
          setTotalLeituras((atual) => atual + 1);

          if (!graficoAtivoRef.current) return;

          const ultima = ultimaLeituraGraficoRef.current;

          if (ultima === null) {
            adicionarPontoGrafico();
            return;
          }

          const diferenca = Math.abs(novoNivel - ultima.nivel);

          if (diferenca >= MUDANCA_BRUSCA_CM) {
            adicionarPontoGrafico();
          }
        } catch {
          console.warn("JSON inválido recebido:", texto);
        }
      },
      [adicionarPontoGrafico]
    );

    const abrirPorta = useCallback(
      async (port: SerialPort) => {
        if (abrindoRef.current || portRef.current) return;

        abrindoRef.current = true;
        setErro(null);

        try {
          await port.open({ baudRate: 9600 });

          if (intervaloSimulacaoRef.current !== null) {
            clearInterval(intervaloSimulacaoRef.current);
            intervaloSimulacaoRef.current = null;
          }

          pararGrafico();

          portRef.current = port;
          setConectado(true);

          iniciarGrafico();

          let buffer = "";
          const decoder = decoderRef.current;

          if (!port.readable) {
            throw new Error("A porta serial não está disponível para leitura.");
          }

          const reader = port.readable.getReader();
          readerRef.current = reader;

          try {
            while (true) {
              const { value, done } = await reader.read();

              if (done) break;

              buffer += decoder.decode(value, { stream: true });

              const linhas = buffer.split("\n");
              buffer = linhas.pop() ?? "";

              for (const linha of linhas) {
                processarLinha(linha);
              }
            }
          } catch (error) {
            console.error("Erro ao ler a porta serial:", error);
            setErro("A conexão com o Arduino foi interrompida.");
          } finally {
            reader.releaseLock();
            readerRef.current = null;
          }

          pararGrafico();

          try {
            await port.close();
          } catch {
            // A porta pode já estar fechada.
          }

          portRef.current = null;
          nivelAtualRef.current = null;
          setConectado(false);
        } catch (error) {
          console.error("Erro ao conectar:", error);

          portRef.current = null;
          setConectado(false);

          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível conectar ao Arduino."
          );
        } finally {
          abrindoRef.current = false;
        }
      },
      [processarLinha, iniciarGrafico, pararGrafico]
    );

    const conectar = useCallback(async () => {
      setErro(null);

      if (!("serial" in navigator)) {
        setErro(
          "Web Serial não está disponível neste navegador. Use Google Chrome ou Microsoft Edge."
        );
        return;
      }

      try {
        const port = await navigator.serial.requestPort({
          filters: FILTROS_ARDUINO,
        });

        await abrirPorta(port);
      } catch (error) {
        if (error instanceof DOMException && error.name === "NotFoundError") {
          setErro("Nenhuma porta foi selecionada.");
          return;
        }

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível conectar ao Arduino."
        );
      }
    }, [abrirPorta]);

    const desconectar = useCallback(async () => {
      pararGrafico();

      try {
        await readerRef.current?.cancel();
      } catch {
        // O leitor pode já estar encerrado.
      }

      readerRef.current = null;

      try {
        await portRef.current?.close();
      } catch {
        // A porta pode já estar fechada.
      }

      portRef.current = null;
      nivelAtualRef.current = null;
      setConectado(false);
    }, [pararGrafico]);

    const simularLeitura = useCallback(
      (novoNivel: number) => {
        nivelAtualRef.current = novoNivel;
        setNivel(novoNivel);
        setTotalLeituras((atual) => atual + 1);

        if (!graficoAtivoRef.current) return;

        const ultima = ultimaLeituraGraficoRef.current;

        if (
          ultima === null ||
          Math.abs(novoNivel - ultima.nivel) >= MUDANCA_BRUSCA_CM
        ) {
          adicionarPontoGrafico();
        }
      },
      [adicionarPontoGrafico]
    );

    const iniciarSimulacao = useCallback(() => {
      if (conectado || intervaloSimulacaoRef.current !== null) return;

      nivelAtualRef.current = null;
      ultimaLeituraGraficoRef.current = null;

      setNivel(null);
      setLeituras([]);
      setTotalLeituras(0);

      iniciarGrafico();

      let nivelSimulado = 5;
      let subindo = true;

      intervaloSimulacaoRef.current = window.setInterval(() => {
        simularLeitura(nivelSimulado);

        if (subindo) {
          nivelSimulado += 0.5;
          if (nivelSimulado >= 25) subindo = false;
        } else {
          nivelSimulado -= 0.5;
          if (nivelSimulado <= 5) subindo = true;
        }
      }, 1000);
    }, [conectado, iniciarGrafico, simularLeitura]);

    const pararSimulacao = useCallback(() => {
      if (intervaloSimulacaoRef.current !== null) {
        clearInterval(intervaloSimulacaoRef.current);
        intervaloSimulacaoRef.current = null;
      }

      if (!conectado) {
        pararGrafico();
        nivelAtualRef.current = null;
      }
    }, [conectado, pararGrafico]);

    useEffect(() => {
      if (!("serial" in navigator)) return;

      const autoConectar = async () => {
        try {
          const portas = await navigator.serial.getPorts();

          if (portas.length > 0) {
            await abrirPorta(portas[0]);
          }
        } catch (error) {
          console.error("Falha na conexão automática:", error);
        }
      };

      void autoConectar();

      navigator.serial.addEventListener("connect", autoConectar);

      return () => {
        navigator.serial.removeEventListener("connect", autoConectar);
      };
    }, [abrirPorta]);

    useEffect(() => {
      return () => {
        pararGrafico();

        readerRef.current?.cancel().catch(() => {});
        portRef.current?.close().catch(() => {});

        if (intervaloSimulacaoRef.current !== null) {
          clearInterval(intervaloSimulacaoRef.current);
        }
      };
    }, [pararGrafico]);

    return {
      conectado,
      nivel,
      leituras,
      totalLeituras,
      erro,

      conectar,
      desconectar,

      simularLeitura,
      iniciarSimulacao,
      pararSimulacao,
    };
  }