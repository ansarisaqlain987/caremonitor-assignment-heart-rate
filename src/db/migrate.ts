import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, connection } from './index';

migrate(db, { migrationsFolder: './src/db/migrations' }).then(async () => {
    // Don't forget to close the connection, otherwise the script will hang
    await connection.end();
});