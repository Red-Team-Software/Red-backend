import { BadRequestException } from "src/common/infraestructure/infraestructure-exception/bad-request/bad-request.exception";
import { Result } from "src/common/utils/result-handler/result";
import { IConversionService } from "src/order/domain/domain-services/interfaces/conversion-currency-interface";
import { ConvertAmount } from "src/order/domain/value_objects/vo-domain-services/convert-amount";
import { ExchangeRateSingelton } from "src/common/infraestructure/exchange-rate/exchange-rate-singleton";
import { IExchangeRateResponse } from "../interfaces/exchange-rate-response.interface";
import { reverseCurrencyMap } from "../helper/exchange-rate-currency-map";
import { OrderCurrencyEnum } from "src/order/domain/value_objects/enum/order-enum-currency-total-amoun";


export class ConvertCurrencyExchangeRate implements IConversionService {
    private exchange: ExchangeRateSingelton;

    constructor(
        exchange: ExchangeRateSingelton
    ) {
        this.exchange = exchange;
    }
    async convertAmount(amount: ConvertAmount, currency: OrderCurrencyEnum): Promise<Result<ConvertAmount>> {
        try{

            let currencyHaving=reverseCurrencyMap[amount.Currency]
            let currencyToChange=reverseCurrencyMap[currency]


            const url = `https://v6.exchangerate-api.com/v6/${this.exchange.getapiKey()}/pair/${currencyHaving}/${currencyToChange}/${amount.Amount}`;

            let response = await fetch(url);
            if (!response.ok)  
                return Result.fail(new BadRequestException());
            
            let data: IExchangeRateResponse = await response.json();
            let amt = data.conversion_result;
            
            let roundedAmt = Math.round(amt * 100) / 100;
            
            let newAmount = ConvertAmount.create(roundedAmt,currency);

            return Result.success(newAmount);
        }catch(error){
            return Result.fail(new BadRequestException());
        }
    }

    // async convertAmountUSDtoVES(amount: ConvertAmount): Promise<Result<ConvertAmount>> {
    //     try{

    //         let currency1=reverseCurrencyMap[amount.Currency]

    //         const url = `https://v6.exchangerate-api.com/v6/${this.exchange.getapiKey()}/pair/USD/VES/${amount.Amount}`;

    //         let response = await fetch(url);
    //         if (!response.ok)  
    //             return Result.fail(new BadRequestException());
            
    //         let data: IExchangeRateResponse = await response.json();
    //         let amt = data.conversion_result;
            
    //         let roundedAmt = Math.round(amt * 100) / 100;
            
    //         let newAmount = ConvertAmount.create(roundedAmt,'bsf');

    //         return Result.success(newAmount);
    //     }catch(error){
    //         console.log(error);
    //         return Result.fail(new BadRequestException());
    //     }
    // }

    // async convertAmountVEStoUSD(amount: ConvertAmount): Promise<Result<ConvertAmount>> {
    //     try{
    //         const url = `https://v6.exchangerate-api.com/v6/${this.exchange.getapiKey()}/pair/VES/USD/${amount.Amount}`;

    //         let response = await fetch(url);
    //         if (!response.ok)  
    //             return Result.fail(new BadRequestException());
            
    //         let data: IExchangeRateResponse = await response.json();
    //         let amt = data.conversion_result;
            
    //         let roundedAmt = Math.round(amt * 100) / 100;
            
    //         let newAmount = ConvertAmount.create(roundedAmt,'bsf');

    //         return Result.success(newAmount);
    //     }catch(error){
    //         console.log(error);
    //         return Result.fail(new BadRequestException());
    //     }
    // }
}