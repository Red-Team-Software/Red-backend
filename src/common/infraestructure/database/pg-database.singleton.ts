import { DataSource, getMetadataArgsStorage } from "typeorm";

export class PgDatabaseSingleton {
    static instance: DataSource;
    
    static getInstance(): DataSource {
        if (!PgDatabaseSingleton.instance) {
            PgDatabaseSingleton.instance = new DataSource({
                type: "postgres",
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: true,
                entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
            });

            this.instance.initialize(); 
        }
        return PgDatabaseSingleton.instance;
    }
}