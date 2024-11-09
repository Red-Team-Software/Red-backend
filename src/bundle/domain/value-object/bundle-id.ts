import { ValueObject } from "src/common/domain"
import { InvalidBundleIdException } from "../domain-exceptions/invalid-bundle-id-exception"

export class BundleId implements ValueObject<BundleId> {

    private readonly id: string

    equals(valueObject: BundleId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): BundleId {
        return new BundleId( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidBundleIdException() }
        this.id=id
    }

}