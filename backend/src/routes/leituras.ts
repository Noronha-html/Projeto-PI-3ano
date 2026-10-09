import type { FastifyInstance } from "fastify";
import { leituras } from "../db.js";

export async function leiturasRoutes(app: FastifyInstance) {
  // Arduino envia aqui
  app.post<{ Body: { nivel: number } }>("/leituras", async (req, reply) => {
    if (req.headers["x-api-key"] !== process.env.API_KEY) {
      return reply.code(401).send({ erro: "não autorizado" });
    }
    const { nivel } = req.body ?? {};
    if (typeof nivel !== "number") {
      return reply.code(400).send({ erro: "nivel inválido" });
    }
    await leituras.insertOne({ nivel, criadoEm: new Date() });
    return { ok: true };
  });

  // Página consome aqui
  app.get("/leituras", async () => {
    return leituras.find().sort({ criadoEm: -1 }).limit(100).toArray();
  });

  app.get("/leituras/ultima", async () => {
    return leituras.findOne({}, { sort: { criadoEm: -1 } });
  });
}