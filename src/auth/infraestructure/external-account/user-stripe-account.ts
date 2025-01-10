import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton";
import { Result } from "src/common/utils/result-handler/result";
import { IUserExternalAccount } from "src/auth/application/interfaces/user-external-account-interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserCard } from "src/user/application/types/user-card-type";


export class UserStripeAccount implements IUserExternalAccount {    
    private stripe: StripeSingelton;
    
    constructor(
        stripe: StripeSingelton
    ) {
        this.stripe = stripe;
    }
    
    async saveUser(userId: UserId, email: string): Promise<Result<string>> {
        try{
            const customer = await this.stripe.stripeInstance.customers.create({
                email: email,
                metadata: {
                    userId: userId.Value,
                },
            });
            return Result.success(customer.id);
        }catch(error){
            return Result.fail(error);
        };
    }

    async saveCardtoUser(userId: string, cardId: string): Promise<Result<string>> {
        try{
            const paymentMethod = await this.stripe.stripeInstance.paymentMethods.attach(
                cardId, 
                {
                    customer: userId,
                }
            );

            return Result.success("success");
        }catch(error){
            return Result.fail(error);
        };
    }

    async getUserCards(userId: string): Promise<Result<UserCard[]>> {
        try{
            
            const paymentMethods = await this.stripe.stripeInstance.paymentMethods.list({
                customer: userId
            });
            
            const cards = paymentMethods.data.map((card) => {
                return {
                    id: card.id,
                    brand: card.card.brand,
                    last4: card.card.last4,
                    exp_month: card.card.exp_month,
                    exp_year: card.card.exp_year,
                };
            });

            return Result.success(cards);
        }catch(error){
            return Result.fail(error);
        };
    }
    
}