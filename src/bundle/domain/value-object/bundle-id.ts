import { ValueObject } from "src/common/domain"

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
        this.id=id
    }

}