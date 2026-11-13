import { MongoClient } from "mongodb";

export interface Leitura {
  nivel: number;
  criadoEm: Date;
}

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();

export const leituras = client.db("medidor").collection<Leitura>("leituras");


await leituras.createIndex({ criadoEm: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });