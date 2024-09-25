import 'dotenv/config';

export const dbConnectionOptions = {
    host: process.env.DB_HOST ?? '',
    user: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
    port: Number(process.env.PORT) ?? 5432
}