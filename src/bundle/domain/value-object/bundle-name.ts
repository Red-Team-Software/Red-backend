import { ValueObject } from "src/common/domain"
import { InvalidBundleNameException } from "../domain-exceptions/invalid-bundle-name-exception"

export class BundleName implements ValueObject<BundleName> {

    private readonly name: string

    equals(valueObject: BundleName): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.name }

    static create ( name: string ): BundleName {
        return new BundleName( name )
    }

    private constructor(name:string){
        if (name.length<5) throw new InvalidBundleNameException()
        this.name=name
    }

}