import { envs } from "src/config/envs/envs";

export class HereMapsSingelton{
    private static instance:HereMapsSingelton;

    constructor(envs: string){
        HereMapsSingelton.instance = envs;
    }

    public static getInstance(): HereMapsSingelton {
        if (!HereMapsSingelton.instance) HereMapsSingelton.instance = new HereMapsSingelton(envs.HERE_MAP_API_KEY);
        return HereMapsSingelton.instance;
    }
}