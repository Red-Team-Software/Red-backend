import { ValueObject } from "src/common/domain"

export class BundleCaducityDate implements ValueObject<BundleCaducityDate> {

    private readonly date: Date

    equals(valueObject: BundleCaducityDate): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.date }

    static create ( date: Date ): BundleCaducityDate {
        return new BundleCaducityDate( date )
    }

    private constructor(date:Date){
        this.date=date
    }

}