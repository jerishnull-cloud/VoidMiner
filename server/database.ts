import { Pool, type QueryResultRow } from 'pg';

let pool: Pool | undefined;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('YOUR_DATABASE_PASSWORD')) {
    throw new Error('DATABASE_URL is missing. Add your encoded Supabase database password to the local environment.');
  }

  let databaseUrl: URL;
  try {
    databaseUrl = new URL(connectionString);
  } catch {
    throw new Error('DATABASE_URL is invalid. Check the format and percent-encode special characters in the password.');
  }

  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the PostgreSQL protocol.');
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return pool;
}

export async function queryDatabase<Row extends QueryResultRow>(
  sql: string,
  values: unknown[] = [],
) {
  return getPool().query<Row>(sql, values);
}

export async function checkDatabaseConnection(): Promise<string> {
  const result = await queryDatabase<{ database: string }>('SELECT current_database() AS database');
  const database = result.rows[0]?.database;
  if (!database) throw new Error('The database connection returned no database name.');
  return database;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (!pool) return;
  const currentPool = pool;
  pool = undefined;
  await currentPool.end();
}
