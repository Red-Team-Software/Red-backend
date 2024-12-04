import { ValueObject } from "src/common/domain"


export class PaymentMethod implements ValueObject<PaymentMethod> {

    private readonly method: string
    
    private constructor(method:string){

        this.method=method;
    }

    equals(valueObject: PaymentMethod): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ 
        return this.method 
    }

    static create ( method: string ): PaymentMethod {
        return new PaymentMethod( method )
    }


}