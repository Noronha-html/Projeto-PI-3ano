const API_URL = "http://localhost:3000";

const API_KEY = import.meta.env.VITE_API_KEY;

export interface LeituraBackend {
  _id?: string;
  nivel: number;
  criadoEm: string;
}

export async function salvarLeitura(
  nivel: number
) {
  const response = await fetch(
    `${API_URL}/leituras`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },

      body: JSON.stringify({
        nivel,
      }),
    }
  );

  if (!response.ok) {
    const erro = await response.text();

    throw new Error(
      `Erro ao salvar leitura: ${response.status} ${erro}`
    );
  }

  return response.json();
}

export async function buscarLeituras(): Promise<LeituraBackend[]> {
  const response = await fetch(
    `${API_URL}/leituras`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(
      "Não foi possível buscar as leituras."
    );
  }
  return response.json();
}

export async function buscarUltimaLeitura(): Promise<
  LeituraBackend | null
> {
  const response = await fetch(
    `${API_URL}/leituras/ultima`
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível buscar a última leitura."
    );
  }

  return response.json();
}