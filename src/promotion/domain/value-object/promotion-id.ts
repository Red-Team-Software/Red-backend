import { ValueObject } from "src/common/domain"
import { InvalidPromotionIdException } from "../domain-exceptions/invalid-promotion-id-exception"

export class PromotionId implements ValueObject<PromotionId> {

    private readonly id: string

    equals(valueObject: PromotionId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): PromotionId {
        return new PromotionId( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidPromotionIdException() }
        this.id=id
    }

}