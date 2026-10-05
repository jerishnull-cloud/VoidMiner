import dotenv from 'dotenv';
import { checkDatabaseConnection, closeDatabaseConnection } from '../server/database.js';

dotenv.config();

async function main(): Promise<void> {
  try {
    const database = await checkDatabaseConnection();
    console.log(`Connected to Supabase database "${database}".`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database connection error.';
    console.error(`Database connection check failed: ${message}`);
    process.exitCode = 1;
  } finally {
    await closeDatabaseConnection();
  }
}

void main();
