import { ValueObject } from "src/common/domain"

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
        this.id=id
    }

}