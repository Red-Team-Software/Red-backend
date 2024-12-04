import { ValueObject } from "src/common/domain"
import { InvalidPromotionDescriptionException } from "../domain-exceptions/invalid-promotion-description-exception"

export class PromotionDescription implements ValueObject<PromotionDescription> {

    private readonly description: string

    equals(valueObject: PromotionDescription): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.description }

    static create ( description: string ): PromotionDescription {
        return new PromotionDescription( description )
    }

    private constructor(description:string){
        if (description.length<5) throw new InvalidPromotionDescriptionException(description)
        this.description=description
    }

}