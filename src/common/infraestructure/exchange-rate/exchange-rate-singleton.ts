import { envs } from "src/config/envs/envs";


export class ExchangeRateSingelton{
    private static instance:ExchangeRateSingelton;
    private apiKey: string;

    private constructor(apiKey: string){
        this.apiKey = apiKey;
    }

    public static getInstance(): ExchangeRateSingelton {
        if (!ExchangeRateSingelton.instance) ExchangeRateSingelton.instance = new ExchangeRateSingelton(
            envs.EXCHANGE_RATE_API_KEY
        );
        return ExchangeRateSingelton.instance;
    }

    public getapiKey(): string{
        return this.apiKey;
    }
}