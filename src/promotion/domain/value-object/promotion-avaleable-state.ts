import { ValueObject } from "src/common/domain"

export class PromotionAvaleableState implements ValueObject<PromotionAvaleableState> {

    private readonly state: boolean

    equals(valueObject: PromotionAvaleableState): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.state }

    static create ( state: boolean ): PromotionAvaleableState {
        return new PromotionAvaleableState( state )
    }

    private constructor(state:boolean){
        this.state=state
    }

}