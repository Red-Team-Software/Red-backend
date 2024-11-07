import { ValueObject } from "src/common/domain"
import { InvalidProductDescriptionException } from "../domain-exceptions/invalid-product-description-exception"

export class ProductDescription implements ValueObject<ProductDescription> {

    private readonly description: string

    equals(valueObject: ProductDescription): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.description }

    static create ( description: string ): ProductDescription {
        return new ProductDescription( description )
    }

    private constructor(description:string){
        if (description.length<5) throw new InvalidProductDescriptionException()
        this.description=description
    }

}