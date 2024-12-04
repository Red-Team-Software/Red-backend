import { ValueObject } from "src/common/domain"
import { InvalidPromotionDiscountException } from "../domain-exceptions/invalid-promotion-discount-exception"

export class PromotionDiscount implements ValueObject<PromotionDiscount> {

    private readonly discount: number

    equals(valueObject: PromotionDiscount): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.discount }

    static create ( discount: number ): PromotionDiscount {
        return new PromotionDiscount( discount )
    }

    private constructor(discount:number){
        if (discount<0 || discount>1) throw new InvalidPromotionDiscountException(discount)
        this.discount=discount
    }

}