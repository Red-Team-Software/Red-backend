import { ValueObject } from "src/common/domain"
import { PromotionStateEnum } from "./enum/promotion-state.enum"
import { InvalidPromotionStateException } from "../domain-exceptions/invalid-promotion-state-exception"

export class PromotionState implements ValueObject<PromotionState> {

    private readonly state: string

    equals(valueObject: PromotionState): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.state }

    static create (state:string): PromotionState {
        
        if(!PromotionStateEnum[state])
            throw new InvalidPromotionStateException(state);
        
        return new PromotionState(state)
    }

    private constructor(state:string){
        this.state=state
    }

}