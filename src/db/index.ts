import './../common/env'
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { dbConnectionOptions } from '../common/config';

// for query purposes
export const connection = postgres(dbConnectionOptions);
export const db = drizzle(connection, { schema });