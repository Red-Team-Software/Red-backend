import { ValueObject } from "src/common/domain"
import { InvalidProductPriceException } from "../domain-exceptions/invalid-product-price-exception"

export class ProductPrice implements ValueObject<ProductPrice> {

    private readonly price: number

    equals(valueObject: ProductPrice): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.price }

    static create ( price: number ): ProductPrice {
        return new ProductPrice( price )
    }

    private constructor(price:number){
        if (price<=0) throw new InvalidProductPriceException()
        this.price=price
    }

}