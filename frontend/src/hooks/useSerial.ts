import { useCallback, useEffect, useRef, useState } from "react";

export interface LeituraAgua {
  nivel: number;
  timestamp: number;
}

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

  // ============================================================
  // RECEBE UMA LINHA DO ARDUINO
  // ============================================================

  const processarLinha = useCallback((linha: string) => {
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

      const novaLeitura: LeituraAgua = {
        nivel: dados.nivel,
        timestamp: Date.now(),
      };

      setNivel(dados.nivel);

      setLeituras((atual) => {
        const novasLeituras = [...atual, novaLeitura];

        // Guarda somente as últimas 60 leituras
        return novasLeituras.slice(-60);
      });

      setTotalLeituras((atual) => atual + 1);
    } catch {
      console.warn(
        "Não foi possível interpretar o dado recebido:",
        texto
      );
    }
  }, []);

  // ============================================================
  // CONECTAR AO ARDUINO
  // ============================================================

  const conectar = useCallback(async () => {
    setErro(null);

    // Verifica se o navegador possui Web Serial
    if (!("serial" in navigator)) {
      setErro(
        "Seu navegador não suporta Web Serial. Use Google Chrome ou Microsoft Edge."
      );
      return;
    }

    try {
      // Abre a janela para escolher o Arduino
      const port = await navigator.serial.requestPort();

      // Abre a conexão serial
      await port.open({
        baudRate: 9600,
      });

      portRef.current = port;

      setConectado(true);

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

            buffer += decoder.decode(value, {
              stream: true,
            });

            const linhas = buffer.split("\n");

            // A última parte pode estar incompleta
            buffer = linhas.pop() ?? "";

            for (const linha of linhas) {
              processarLinha(linha);
            }
          }
        } catch (error) {
          console.error(
            "Erro durante leitura da porta serial:",
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
      console.error("Erro ao conectar:", error);

      setConectado(false);

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
  }, [processarLinha]);

  // ============================================================
  // DESCONECTAR ARDUINO
  // ============================================================

  const desconectar = useCallback(async () => {
    try {
      await readerRef.current?.cancel();
    } catch {
      // Não faz nada se o reader já estiver fechado
    }

    readerRef.current = null;

    try {
      await portRef.current?.close();
    } catch {
      // Não faz nada se a porta já estiver fechada
    }

    portRef.current = null;

    setConectado(false);
  }, []);

  // ============================================================
  // SIMULAÇÃO
  // ============================================================

  const simularLeitura = useCallback((novoNivel: number) => {
    const novaLeitura: LeituraAgua = {
      nivel: novoNivel,
      timestamp: Date.now(),
    };

    setNivel(novoNivel);

    setLeituras((atual) => {
      const novas = [...atual, novaLeitura];

      return novas.slice(-60);
    });

    setTotalLeituras((atual) => atual + 1);
  }, []);

  const intervaloSimulacaoRef = useRef<number | null>(null);

  // ============================================================
  // INICIAR SIMULAÇÃO AUTOMÁTICA
  // ============================================================

  const iniciarSimulacao = useCallback(() => {
    if (intervaloSimulacaoRef.current !== null) {
      return;
    }

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
  }, [simularLeitura]);

  // ============================================================
  // PARAR SIMULAÇÃO
  // ============================================================

  const pararSimulacao = useCallback(() => {
    if (intervaloSimulacaoRef.current !== null) {
      clearInterval(intervaloSimulacaoRef.current);

      intervaloSimulacaoRef.current = null;
    }
  }, []);

  // ============================================================
  // LIMPEZA
  // ============================================================

  useEffect(() => {
    return () => {
      readerRef.current?.cancel().catch(() => {});
      portRef.current?.close().catch(() => {});

      if (intervaloSimulacaoRef.current !== null) {
        clearInterval(intervaloSimulacaoRef.current);
      }
    };
  }, []);

  // ============================================================
  // RETORNO
  // ============================================================

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