import Fastify from "fastify";
import cors from "@fastify/cors";
import { leiturasRoutes } from "./routes/leituras.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: process.env.SITE_URL ?? true });
await app.register(leiturasRoutes);

await app.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" });