import { Mongoose, connect } from "mongoose";
import { envs } from "src/config/envs/envs";

export class MongoDatabaseSingleton {
    static instance: Mongoose;
    
    static async getInstance(): Promise<Mongoose> {
        if (!MongoDatabaseSingleton.instance) {
            MongoDatabaseSingleton.instance = await connect(envs.MONGO_DB_HOST);
        }
        return MongoDatabaseSingleton.instance;
    }
}