import { ValueObject } from "src/common/domain"
import { InvalidBundlePriceException } from "../domain-exceptions/invalid-bundle-price-exception"
import { BundleCurrencyEnum } from "./enums/bundle-currency.enum"
import { InvalidBundleCurrencyException } from "../domain-exceptions/invalid-bundle-currency-exception"

export class BundlePrice implements ValueObject<BundlePrice> {

    private readonly currency:string
    private readonly price: number

    equals(valueObject: BundlePrice): boolean {
        if (this.Price===valueObject.Price &&
            this.Currency===valueObject.Currency
        ) return true
        return false
    }
    
    get Price(){ return this.price }

    get Currency(){ return this.currency }

    static create ( price: number, currency:string): BundlePrice {
        return new BundlePrice( price,currency )
    }

    private constructor(price:number,currency:string){
        if (price<=0) throw new InvalidBundlePriceException()
        if ( 
            BundleCurrencyEnum.bsf != currency &&
            BundleCurrencyEnum.eur != currency &&
            BundleCurrencyEnum.usd != currency
        ) throw new InvalidBundleCurrencyException()
        this.currency=currency
        this.price=price
    }

}