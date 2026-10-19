import { useCallback, useEffect, useRef, useState } from "react";

export interface LeituraAgua {
  nivel: number;
  timestamp: number;
}

// ==========================================================
// CONFIGURAÇÕES
// ==========================================================

// Intervalo normal entre pontos do gráfico.
const INTERVALO_GRAFICO_MS = 1500;

// Se a mudança for maior ou igual a isso,
// o gráfico atualiza imediatamente.
const MUDANCA_BRUSCA_CM = 2.0;

// Quantidade máxima de pontos mantidos no gráfico.
const MAX_LEITURAS_GRAFICO = 30;

// Só mostra placas Arduino (e clones comuns) na janela de seleção.
const FILTROS_ARDUINO = [
  { usbVendorId: 0x2341 }, // Arduino oficial
  { usbVendorId: 0x1a86 }, // clones com chip CH340
  { usbVendorId: 0x0403 }, // FTDI
  { usbVendorId: 0x10c4 }, // CP210x
];

export function useSerial() {
  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [conectado, setConectado] = useState(false);

  const [nivel, setNivel] = useState<number | null>(null);

  const [leituras, setLeituras] = useState<LeituraAgua[]>([]);

  const [totalLeituras, setTotalLeituras] = useState(0);

  const [erro, setErro] = useState<string | null>(null);

  // ==========================================================
  // PORTA SERIAL
  // ==========================================================

  const portRef = useRef<SerialPort | null>(null);

  const readerRef =
    useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const decoderRef = useRef(new TextDecoder());

  // Evita abrir a porta duas vezes ao mesmo tempo.
  const abrindoRef = useRef(false);

  // ==========================================================
  // CONTROLE DO NÍVEL
  // ==========================================================

  const nivelAtualRef = useRef<number | null>(null);

  // Último ponto que entrou no gráfico.
  const ultimaLeituraGraficoRef = useRef<LeituraAgua | null>(null);

  // ==========================================================
  // CONTROLE DO INTERVALO DO GRÁFICO
  // ==========================================================

  const intervaloGraficoRef = useRef<number | null>(null);

  const graficoAtivoRef = useRef(false);

  // ==========================================================
  // INTERVALO DA SIMULAÇÃO
  // ==========================================================

  const intervaloSimulacaoRef = useRef<number | null>(null);

  // ==========================================================
  // ADICIONAR PONTO AO GRÁFICO
  // ==========================================================

  const adicionarPontoGrafico = useCallback(() => {
    if (!graficoAtivoRef.current) {
      return;
    }

    const nivelAtual = nivelAtualRef.current;

    if (nivelAtual === null) {
      return;
    }

    const novaLeitura: LeituraAgua = {
      nivel: nivelAtual,
      timestamp: Date.now(),
    };

    ultimaLeituraGraficoRef.current = novaLeitura;

    setLeituras((atual) => {
      const novasLeituras = [...atual, novaLeitura];

      return novasLeituras.slice(-MAX_LEITURAS_GRAFICO);
    });
  }, []);

  // ==========================================================
  // INICIAR GRÁFICO
  // ==========================================================

  const iniciarGrafico = useCallback(() => {
    if (intervaloGraficoRef.current !== null) {
      return;
    }

    graficoAtivoRef.current = true;

    intervaloGraficoRef.current = window.setInterval(() => {
      adicionarPontoGrafico();
    }, INTERVALO_GRAFICO_MS);
  }, [adicionarPontoGrafico]);

  // ==========================================================
  // PARAR GRÁFICO
  // ==========================================================

  const pararGrafico = useCallback(() => {
    graficoAtivoRef.current = false;

    if (intervaloGraficoRef.current !== null) {
      clearInterval(intervaloGraficoRef.current);

      intervaloGraficoRef.current = null;
    }
  }, []);

  // ==========================================================
  // PROCESSAR LINHA DO ARDUINO
  // ==========================================================

  const processarLinha = useCallback(
    (linha: string) => {
      const texto = linha.trim();

      if (!texto) {
        return;
      }

      try {
        const dados = JSON.parse(texto);

        if (
          typeof dados.nivel !== "number" ||
          !Number.isFinite(dados.nivel)
        ) {
          console.warn("Dados inválidos recebidos:", dados);

          return;
        }

        const novoNivel = dados.nivel;

        nivelAtualRef.current = novoNivel;

        setNivel(novoNivel);

        setTotalLeituras((atual) => atual + 1);

        if (!graficoAtivoRef.current) {
          return;
        }

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
        console.warn("Não foi possível interpretar:", texto);
      }
    },
    [adicionarPontoGrafico]
  );

  // ==========================================================
  // ABRIR PORTA E LER DADOS
  // (usada pelo botão e pela conexão automática)
  // ==========================================================

  const abrirPorta = useCallback(
    async (port: SerialPort) => {
      if (abrindoRef.current || portRef.current) {
        return;
      }

      abrindoRef.current = true;
      setErro(null);

      try {
        if (intervaloSimulacaoRef.current !== null) {
          clearInterval(intervaloSimulacaoRef.current);
          intervaloSimulacaoRef.current = null;
        }

        await port.open({ baudRate: 9600 });

        portRef.current = port;
        setConectado(true);
        iniciarGrafico();

        let buffer = "";
        const decoder = decoderRef.current;

        while (port.readable) {
          const reader = port.readable.getReader();
          readerRef.current = reader;

          try {
            while (true) {
              const { value, done } = await reader.read();

              if (done) {
                break;
              }

              buffer += decoder.decode(value, { stream: true });

              const linhas = buffer.split("\n");
              buffer = linhas.pop() ?? "";

              for (const linha of linhas) {
                processarLinha(linha);
              }
            }
          } catch (error) {
            console.error("Erro durante leitura serial:", error);
            setErro("A conexão com o Arduino foi interrompida.");
          } finally {
            reader.releaseLock();
            readerRef.current = null;
          }

          break;
        }

        // A leitura terminou (cabo removido ou desconexão):
        // limpa tudo para permitir reconectar depois.
        pararGrafico();

        try {
          await port.close();
        } catch {
          // Ignora
        }

        portRef.current = null;
        nivelAtualRef.current = null;
        setConectado(false);
      } catch (error) {
        console.error("Erro ao conectar:", error);

        portRef.current = null;
        setConectado(false);

        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Não foi possível conectar ao Arduino.");
        }
      } finally {
        abrindoRef.current = false;
      }
    },
    [processarLinha, iniciarGrafico, pararGrafico]
  );

  // ==========================================================
  // CONECTAR AO ARDUINO (botão)
  // ==========================================================

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
      if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setErro("Nenhuma porta foi selecionada.");
        return;
      }

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível conectar ao Arduino.");
      }
    }
  }, [abrirPorta]);

  // ==========================================================
  // DESCONECTAR ARDUINO
  // ==========================================================

  const desconectar = useCallback(async () => {
    pararGrafico();

    try {
      await readerRef.current?.cancel();
    } catch {
      // Ignora
    }

    readerRef.current = null;

    try {
      await portRef.current?.close();
    } catch {
      // Ignora
    }

    portRef.current = null;

    nivelAtualRef.current = null;

    setConectado(false);
  }, [pararGrafico]);

  // ==========================================================
  // SIMULAÇÃO
  // ==========================================================

  const simularLeitura = useCallback(
    (novoNivel: number) => {
      nivelAtualRef.current = novoNivel;

      setNivel(novoNivel);

      setTotalLeituras((atual) => atual + 1);

      if (!graficoAtivoRef.current) {
        return;
      }

      const ultima = ultimaLeituraGraficoRef.current;

      if (ultima === null) {
        adicionarPontoGrafico();
        return;
      }

      const diferenca = Math.abs(novoNivel - ultima.nivel);

      if (diferenca >= MUDANCA_BRUSCA_CM) {
        adicionarPontoGrafico();
      }
    },
    [adicionarPontoGrafico]
  );

  const iniciarSimulacao = useCallback(() => {
    if (intervaloSimulacaoRef.current !== null) {
      return;
    }

    if (conectado) {
      return;
    }

    iniciarGrafico();

    let nivelAtual = 5;

    let subindo = true;

    intervaloSimulacaoRef.current = window.setInterval(() => {
      simularLeitura(nivelAtual);

      if (subindo) {
        nivelAtual += 0.5;

        if (nivelAtual >= 25) {
          subindo = false;
        }
      } else {
        nivelAtual -= 0.5;

        if (nivelAtual <= 5) {
          subindo = true;
        }
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
    }
  }, [conectado, pararGrafico]);

  // ==========================================================
  // CONEXÃO AUTOMÁTICA
  //
  // Depois da primeira autorização, o navegador lembra do
  // Arduino. Ao abrir a página, ou ao plugar o cabo, conecta
  // sozinho, sem janela de seleção.
  // ==========================================================

  useEffect(() => {
    if (!("serial" in navigator)) {
      return;
    }

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

    autoConectar();

    navigator.serial.addEventListener("connect", autoConectar);

    return () => {
      navigator.serial.removeEventListener("connect", autoConectar);
    };
  }, [abrirPorta]);

  // ==========================================================
  // LIMPEZA
  // ==========================================================

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

  // ==========================================================
  // RETORNO
  // ==========================================================

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