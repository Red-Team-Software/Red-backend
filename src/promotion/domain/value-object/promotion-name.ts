import { ValueObject } from "src/common/domain"
import { InvalidPromotionNameException } from "../domain-exceptions/invalid-promotion-name-exception"

export class PromotionName implements ValueObject<PromotionName> {

    private readonly name: string

    equals(valueObject: PromotionName): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.name }

    static create ( name: string ): PromotionName {
        return new PromotionName( name )
    }

    private constructor(name:string){
        if (name.length<5) 
            throw new InvalidPromotionNameException(name)
        this.name=name
    }

}