import { BadRequestException } from "src/common/infraestructure/infraestructure-exception/bad-request/bad-request.exception";
import { Result } from "src/common/utils/result-handler/result";
import { IConversionService } from "src/order/domain/domain-services/conversion-currency-interface";
import { ConvertAmount } from "src/order/domain/value_objects/vo-domain-services/convert-amount";
import { ExchangeRateSingelton } from "src/payments/infraestructure/exchange-rate-singleton";
import { IExchangeRateResponse } from "../interfaces/exchange-rate-response.interface";


export class ConvertCurrencyExchangeRate implements IConversionService {
    private exchange: ExchangeRateSingelton;

    constructor(
        exchange: ExchangeRateSingelton
    ) {
        this.exchange = exchange;
    }

    async convertAmount(amount: ConvertAmount): Promise<Result<ConvertAmount>> {
        try{
            const url = `https://v6.exchangerate-api.com/v6/${this.exchange.getapiKey()}/pair/USD/VES/${amount.Amount}`;

            let response = await fetch(url);
            if (!response.ok)  
                return Result.fail(new BadRequestException());
            
            let data: IExchangeRateResponse = await response.json();
            let amt = data.conversion_result;
            
            let roundedAmt = Math.round(amt * 100) / 100;
            
            let newAmount = ConvertAmount.create(roundedAmt,'bsf');

            return Result.success(newAmount);
        }catch(error){
            console.log(error);
            return Result.fail(new BadRequestException());
        }
    }
}