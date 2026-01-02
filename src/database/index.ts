import { drizzle as nodeClient } from 'drizzle-orm/node-postgres';
import { drizzle as neonClient } from 'drizzle-orm/neon-http';

function createDatabaseClient(environment: 'development' | 'production' | 'test') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  if (environment === 'development') {
    return nodeClient(process.env.DATABASE_URL);
  }

  return neonClient(process.env.DATABASE_URL);
}

export const db = createDatabaseClient(process.env.NODE_ENV as 'development' | 'production' | 'test' ?? 'development');
export { user } from './schema';
