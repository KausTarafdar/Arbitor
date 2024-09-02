import pg from "pg";
const { Client } = pg;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.port,
  database: process.env.services,
}

export const client = new Client(config);

export async function connectToDB() {
  await client.connect();
  console.log('Connected to Postgres');
}