import { ValueObject } from "src/common/domain"

export class ProductCaducityDate implements ValueObject<ProductCaducityDate> {

    private readonly date: Date

    equals(valueObject: ProductCaducityDate): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.date }

    static create ( date: Date ): ProductCaducityDate {
        return new ProductCaducityDate( date )
    }

    private constructor(date:Date){
        this.date=date
    }

}