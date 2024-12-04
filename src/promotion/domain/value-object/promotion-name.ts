import { ValueObject } from "src/common/domain"

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
        this.name=name
    }

}