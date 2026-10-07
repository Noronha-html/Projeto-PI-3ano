import { useSerial } from "../hooks/useSerial";

export default function ArduinoTest() {
  const {
    conectado,
    nivel,
    leituras,
    totalLeituras,
    erro,
    conectar,
    desconectar,
    iniciarSimulacao,
    pararSimulacao,
  } = useSerial();

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "20px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "10px",
        }}
      >
        Teste do AquaSense
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "25px",
        }}
      >
        Comunicação com o Arduino via USB
      </p>

      {/* STATUS */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: conectado
              ? "#22c55e"
              : "#9ca3af",
          }}
        />

        <strong>
          {conectado ? "Arduino conectado" : "Arduino desconectado"}
        </strong>
      </div>

      {/* NÍVEL */}

      <div
        style={{
          padding: "25px",
          borderRadius: "16px",
          background: "#f8fafc",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#64748b",
          }}
        >
          Nível atual
        </p>

        <p
          style={{
            fontSize: "48px",
            fontWeight: "800",
            margin: "5px 0 0",
          }}
        >
          {nivel !== null
            ? `${nivel.toFixed(1)} cm`
            : "--"}
        </p>
      </div>

      {/* TOTAL DE LEITURAS */}

      <p>
        Leituras recebidas:{" "}
        <strong>{totalLeituras}</strong>
      </p>

      {/* ERRO */}

      {erro && (
        <div
          style={{
            padding: "15px",
            marginTop: "20px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {erro}
        </div>
      )}

      {/* BOTÕES */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "25px",
        }}
      >
        {!conectado ? (
          <button
            type="button"
            onClick={conectar}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#22b8cf",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Conectar Arduino
          </button>
        ) : (
          <button
            type="button"
            onClick={desconectar}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#111827",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Desconectar Arduino
          </button>
        )}

        <button
          type="button"
          onClick={iniciarSimulacao}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#0ea5e9",
            color: "#ffffff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Iniciar simulação
        </button>

        <button
          type="button"
          onClick={pararSimulacao}
          style={{
            padding: "12px 20px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#374151",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Parar simulação
        </button>
      </div>

      {/* HISTÓRICO */}

      <div style={{ marginTop: "30px" }}>
        <h3>Últimas leituras</h3>

        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "15px",
          }}
        >
          {leituras.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              Nenhuma leitura ainda.
            </p>
          ) : (
            [...leituras].reverse().map((leitura) => (
              <div
                key={leitura.timestamp}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <span>
                  {new Date(
                    leitura.timestamp
                  ).toLocaleTimeString()}
                </span>

                <strong>
                  {leitura.nivel.toFixed(1)} cm
                </strong>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}