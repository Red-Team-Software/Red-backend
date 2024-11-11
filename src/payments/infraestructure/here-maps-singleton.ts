import { envs } from "src/config/envs/envs";

export class HereMapsSingelton{
    private static instance:HereMapsSingelton;
    private apiKey: string;

    private constructor(apiKey: string){
        this.apiKey = apiKey;
    }

    public static getInstance(): HereMapsSingelton {
        if (!HereMapsSingelton.instance) HereMapsSingelton.instance = new HereMapsSingelton(envs.HERE_MAP_API_KEY);
        return HereMapsSingelton.instance;
    }

    public getapiKey(): string{
        return this.apiKey;
    }
}