import { ValueObject } from "src/common/domain"
import { InvalidProductNameException } from "../domain-exceptions/invalid-product-name-exception"

export class ProductName implements ValueObject<ProductName> {

    private readonly name: string

    equals(valueObject: ProductName): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.name }

    static create ( name: string ): ProductName {
        return new ProductName( name )
    }

    private constructor(name:string){
        if (name.length<5) throw new InvalidProductNameException()
        this.name=name
    }

}