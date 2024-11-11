import { envs } from "src/config/envs/envs";
import { DataSource, getMetadataArgsStorage } from "typeorm";

export class PgDatabaseSingleton {
    static instance: DataSource;
    
    static getInstance(): DataSource {
        if (!PgDatabaseSingleton.instance) {
            PgDatabaseSingleton.instance = new DataSource({
                ssl: envs.NODE_ENV === 'production',
                extra: {
                  ssl: envs.NODE_ENV === 'production'
                        ? { rejectUnauthorized: false }
                        : null,
                },
                type: "postgres",
                host: process.env.POSTGRES_DB_HOST,
                port: +process.env.POSTGRES_DB_PORT,
                username: process.env.POSTGRES_DB_USERNAME,
                password: process.env.POSTGRES_DB_PASSWORD,
                database: process.env.POSTGRES_DB_NAME,
                synchronize: true,
                entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            });

            this.instance.initialize(); 
        }
        return PgDatabaseSingleton.instance;
    }
}