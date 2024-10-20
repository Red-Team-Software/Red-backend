import { Provider } from "@nestjs/common";
import { MongoDatabaseSingleton } from "../database/mongo-database.singleton";

export const odmDatabaseProvider: Provider = {
    provide: 'OdmDataSource',
    useFactory: async () => {
        return MongoDatabaseSingleton.getInstance();
    }
}