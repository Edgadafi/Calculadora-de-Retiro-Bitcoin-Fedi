/**
 * Aplica agents/supabase/schema.sql vía conexión Postgres directa.
 * Uso: DATABASE_URL="postgresql://postgres:PASSWORD@db.jfjjsqacwelagleggyal.supabase.co:5432/postgres" node scripts/apply-schema.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Falta DATABASE_URL (Settings → Database → Connection string → URI en Supabase).');
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log('Schema aplicado: leads, chat_sessions, knowledge_chunks, legal_alerts, etc.');
} catch (err) {
  console.error('Error aplicando schema:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
