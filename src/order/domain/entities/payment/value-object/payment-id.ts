import { ValueObject } from "src/common/domain/value-object/value-object"
import { InvalidOrderProductIdException } from "../exceptions/invalid-uuid-payment-id-exception"


export class PaymentId implements ValueObject<PaymentId> {

    private readonly id: string

    equals(valueObject: PaymentId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): PaymentId {
        return new PaymentId( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidOrderProductIdException() }
        this.id=id
    }

}
