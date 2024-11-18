import { ValueObject } from "src/common/domain"
import { InvalidBundleDescriptionException } from "../domain-exceptions/invalid-bundle-description-exception"

export class BundleDescription implements ValueObject<BundleDescription> {

    private readonly description: string

    equals(valueObject: BundleDescription): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.description }

    static create ( description: string ): BundleDescription {
        return new BundleDescription( description )
    }

    private constructor(description:string){
        if (description.length<5) throw new InvalidBundleDescriptionException()
        this.description=description
    }

}