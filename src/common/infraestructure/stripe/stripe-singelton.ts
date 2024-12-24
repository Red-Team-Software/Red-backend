import { envs } from "src/config/envs/envs";
import Stripe from "stripe";

export class StripeSingelton{
    private static instance:StripeSingelton
    public stripeInstance:Stripe
    constructor(){
        this.stripeInstance=new Stripe(envs.STRIPE_PRIVATE_KEY)
    }

    public static getInstance(): StripeSingelton {
        if (!StripeSingelton.instance) StripeSingelton.instance = new StripeSingelton();
        return StripeSingelton.instance;
    }
}