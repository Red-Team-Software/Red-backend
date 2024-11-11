import { ValueObject } from "src/common/domain"
import { InvalidProductPriceException } from "../domain-exceptions/invalid-product-price-exception"
import { InvalidProductCurrencyException } from "../domain-exceptions/invalid-product-currency-exception"
import { ProductCurrencyEnum } from "./enums/product-currency.enum"

export class ProductPrice implements ValueObject<ProductPrice> {

    private readonly currency:string
    private readonly price: number

    equals(valueObject: ProductPrice): boolean {
        if (this.Price===valueObject.Price &&
            this.Currency===valueObject.Currency
        ) return true
        return false
    }
    
    get Price(){ return this.price }

    get Currency(){ return this.currency }

    static create ( price: number, currency:string): ProductPrice {
        return new ProductPrice( price,currency )
    }

    private constructor(price:number,currency:string){
        currency=currency.toLowerCase()
        if (price<=0) throw new InvalidProductPriceException()
        if ( 
            ProductCurrencyEnum.bsf != currency &&
            ProductCurrencyEnum.eur != currency &&
            ProductCurrencyEnum.usd != currency
        ) throw new InvalidProductCurrencyException()
        this.currency=currency
        this.price=price
    }

}