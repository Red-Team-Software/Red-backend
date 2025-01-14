import { IConversionService } from "src/order/domain/domain-services/interfaces/conversion-currency-interface";
import { OrderCurrencyEnum } from "src/order/domain/value_objects/enum/order-enum-currency-total-amoun";
import { ConvertAmount } from "src/order/domain/value_objects/vo-domain-services/convert-amount";
import { IConvertBallance } from "src/user/domain/domain-services/interfaces/convert-ballance.interface";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";

export class ConvertDollars implements IConvertBallance{
    
    constructor(private readonly c:IConversionService){}

    async calculate(b:Ballance):Promise<Ballance>{

        if(b.Currency==OrderCurrencyEnum.usd)
            return b
        
        let amounconverted=
        await this.c.convertAmount(ConvertAmount.create(b.Amount,b.Currency),OrderCurrencyEnum.usd)

        if (!amounconverted.isSuccess())
            throw amounconverted.getError

        const amount=amounconverted.getValue
        
        return Ballance.create(amount.Amount,amount.Currency)
    }
}