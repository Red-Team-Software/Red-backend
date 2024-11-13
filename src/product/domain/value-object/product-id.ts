import { ValueObject } from "src/common/domain"
import { InvalidProductIdException } from "../domain-exceptions/invalid-product-id-exception"

export class ProductID implements ValueObject<ProductID> {

    private readonly id: string

    equals(valueObject: ProductID): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): ProductID {
        return new ProductID( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidProductIdException() }
        this.id=id
    }

}