import { Mongoose, connect } from "mongoose";

export class MongoDatabaseSingleton {
    static instance: Mongoose;
    
    static async getInstance(): Promise<Mongoose> {
        if (!MongoDatabaseSingleton.instance) {
            MongoDatabaseSingleton.instance = await connect(process.env.MONGO_DB_HOST);
        }
        return MongoDatabaseSingleton.instance;
    }
}