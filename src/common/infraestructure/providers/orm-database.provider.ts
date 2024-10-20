import { Provider } from "@nestjs/common"
import { PgDatabaseSingleton } from "../database/pg-database.singleton"

export const ormDatabaseProvider: Provider = {
    provide: 'OrmDataSource',
    useFactory: async () => {
        return PgDatabaseSingleton.getInstance()
    },
}