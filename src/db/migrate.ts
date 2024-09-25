import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, connection } from './index';

await migrate(db, { migrationsFolder: './src/db/migrations' });
// Don't forget to close the connection, otherwise the script will hang
await connection.end();