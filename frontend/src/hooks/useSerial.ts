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

  // ==========================================================
  // CONTROLE DO NÍVEL
  // ==========================================================

  const nivelAtualRef = useRef<number | null>(null);

  // Último ponto que entrou no gráfico.
  const ultimaLeituraGraficoRef =
    useRef<LeituraAgua | null>(null);

  // ==========================================================
  // CONTROLE DO INTERVALO DO GRÁFICO
  // ==========================================================

  const intervaloGraficoRef =
    useRef<number | null>(null);

  const graficoAtivoRef =
    useRef(false);

  // ==========================================================
  // ADICIONAR PONTO AO GRÁFICO
  // ==========================================================

  const adicionarPontoGrafico = useCallback(() => {
    // Se o gráfico estiver parado, não faz absolutamente nada.
    if (!graficoAtivoRef.current) {
      return;
    }

    const nivelAtual = nivelAtualRef.current;

    // Se não temos nível, não adiciona ponto.
    if (nivelAtual === null) {
      return;
    }

    const novaLeitura: LeituraAgua = {
      nivel: nivelAtual,
      timestamp: Date.now(),
    };

    ultimaLeituraGraficoRef.current = novaLeitura;

    setLeituras((atual) => {
      const novasLeituras = [
        ...atual,
        novaLeitura,
      ];

      return novasLeituras.slice(
        -MAX_LEITURAS_GRAFICO
      );
    });
  }, []);

  // ==========================================================
  // INICIAR GRÁFICO
  // ==========================================================

  const iniciarGrafico = useCallback(() => {
    // Já está rodando.
    if (
      intervaloGraficoRef.current !== null
    ) {
      return;
    }

    graficoAtivoRef.current = true;

    intervaloGraficoRef.current =
      window.setInterval(() => {
        adicionarPontoGrafico();
      }, INTERVALO_GRAFICO_MS);
  }, [adicionarPontoGrafico]);

  // ==========================================================
  // PARAR GRÁFICO
  // ==========================================================

  const pararGrafico = useCallback(() => {
    graficoAtivoRef.current = false;

    if (
      intervaloGraficoRef.current !== null
    ) {
      clearInterval(
        intervaloGraficoRef.current
      );

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
          console.warn(
            "Dados inválidos recebidos:",
            dados
          );

          return;
        }

        const novoNivel = dados.nivel;

        // ==================================================
        // ATUALIZA NÍVEL ATUAL
        //
        // Isso acontece em toda leitura.
        // ==================================================

        nivelAtualRef.current = novoNivel;

        setNivel(novoNivel);

        setTotalLeituras(
          (atual) => atual + 1
        );

        // ==================================================
        // SE O GRÁFICO ESTIVER DESLIGADO,
        // NÃO FAZ MAIS NADA.
        // ==================================================

        if (!graficoAtivoRef.current) {
          return;
        }

        // ==================================================
        // VERIFICA MUDANÇA BRUSCA
        // ==================================================

        const ultima =
          ultimaLeituraGraficoRef.current;

        if (ultima === null) {
          adicionarPontoGrafico();
          return;
        }

        const diferenca =
          Math.abs(
            novoNivel - ultima.nivel
          );

        // Se mudou muito, atualiza imediatamente.
        if (
          diferenca >=
          MUDANCA_BRUSCA_CM
        ) {
          adicionarPontoGrafico();
        }

      } catch {
        console.warn(
          "Não foi possível interpretar:",
          texto
        );
      }
    },
    [adicionarPontoGrafico]
  );

  // ==========================================================
  // CONECTAR AO ARDUINO
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
      // Se por acaso a simulação estiver rodando,
      // ela deve ser encerrada antes da conexão real.
      if (
        intervaloSimulacaoRef.current !== null
      ) {
        clearInterval(
          intervaloSimulacaoRef.current
        );

        intervaloSimulacaoRef.current = null;
      }

      // Solicita a porta serial.
      const port =
        await navigator.serial.requestPort();

      // Abre a porta.
      await port.open({
        baudRate: 9600,
      });

      portRef.current = port;

      setConectado(true);

      // Começa o relógio do gráfico.
      iniciarGrafico();

      let buffer = "";

      const decoder =
        decoderRef.current;

      while (port.readable) {
        const reader =
          port.readable.getReader();

        readerRef.current = reader;

        try {
          while (true) {
            const {
              value,
              done,
            } = await reader.read();

            if (done) {
              break;
            }

            buffer += decoder.decode(
              value,
              {
                stream: true,
              }
            );

            const linhas =
              buffer.split("\n");

            buffer =
              linhas.pop() ?? "";

            for (const linha of linhas) {
              processarLinha(linha);
            }
          }
        } catch (error) {
          console.error(
            "Erro durante leitura serial:",
            error
          );

          setErro(
            "A conexão com o Arduino foi interrompida."
          );
        } finally {
          reader.releaseLock();

          readerRef.current = null;
        }

        break;
      }

    } catch (error) {
      console.error(
        "Erro ao conectar:",
        error
      );

      setConectado(false);

      if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setErro(
          "Nenhuma porta foi selecionada."
        );

        return;
      }

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(
          "Não foi possível conectar ao Arduino."
        );
      }
    }
  }, [
    processarLinha,
    iniciarGrafico,
  ]);

  // ==========================================================
  // DESCONECTAR ARDUINO
  // ==========================================================

  const desconectar = useCallback(
    async () => {
      // PRIMEIRO:
      // para imediatamente o gráfico.
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

      // Limpa o nível atual.
      nivelAtualRef.current = null;

      // O histórico permanece no gráfico,
      // mas nenhum ponto novo será criado.

      setConectado(false);
    },
    [pararGrafico]
  );

  // ==========================================================
  // SIMULAÇÃO
  // ==========================================================

  const simularLeitura = useCallback(
    (novoNivel: number) => {
      nivelAtualRef.current = novoNivel;

      setNivel(novoNivel);

      setTotalLeituras(
        (atual) => atual + 1
      );

      if (!graficoAtivoRef.current) {
        return;
      }

      const ultima =
        ultimaLeituraGraficoRef.current;

      if (ultima === null) {
        adicionarPontoGrafico();
        return;
      }

      const diferenca =
        Math.abs(
          novoNivel - ultima.nivel
        );

      // Mudança brusca:
      // adiciona imediatamente.
      if (
        diferenca >=
        MUDANCA_BRUSCA_CM
      ) {
        adicionarPontoGrafico();
      }
    },
    [adicionarPontoGrafico]
  );

  // ==========================================================
  // INTERVALO DA SIMULAÇÃO
  // ==========================================================

  const intervaloSimulacaoRef =
    useRef<number | null>(null);

  // ==========================================================
  // INICIAR SIMULAÇÃO
  // ==========================================================

  const iniciarSimulacao =
    useCallback(() => {
      if (
        intervaloSimulacaoRef.current !== null
      ) {
        return;
      }

      // A simulação não deve acontecer
      // ao mesmo tempo que o Arduino real.
      if (conectado) {
        return;
      }

      iniciarGrafico();

      let nivelAtual = 5;

      let subindo = true;

      intervaloSimulacaoRef.current =
        window.setInterval(() => {
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
    }, [
      conectado,
      iniciarGrafico,
      simularLeitura,
    ]);

  // ==========================================================
  // PARAR SIMULAÇÃO
  // ==========================================================

  const pararSimulacao =
    useCallback(() => {
      if (
        intervaloSimulacaoRef.current !== null
      ) {
        clearInterval(
          intervaloSimulacaoRef.current
        );

        intervaloSimulacaoRef.current = null;
      }

      // IMPORTANTE:
      // se não estiver conectado ao Arduino,
      // também para o gráfico.
      if (!conectado) {
        pararGrafico();
      }
    }, [
      conectado,
      pararGrafico,
    ]);

  // ==========================================================
  // LIMPEZA
  // ==========================================================

  useEffect(() => {
    return () => {
      // Para gráfico.
      pararGrafico();

      // Cancela leitura serial.
      readerRef.current
        ?.cancel()
        .catch(() => {});

      // Fecha porta.
      portRef.current
        ?.close()
        .catch(() => {});

      // Para simulação.
      if (
        intervaloSimulacaoRef.current !==
        null
      ) {
        clearInterval(
          intervaloSimulacaoRef.current
        );
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