import { ValueObject } from "src/common/domain"
import { InvalidDirectionIdException } from "../domain-exceptions/invalid-direction-id-exception"

export class DirectionId implements ValueObject<DirectionId> {

    private readonly id: string

    equals(valueObject: DirectionId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): DirectionId {
        return new DirectionId( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidDirectionIdException() }
        this.id=id
    }

}