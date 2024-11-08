import { ValueObject } from "src/common/domain"

export class CategoryId implements ValueObject<CategoryId> {

    private readonly id: string

    equals(valueObject: CategoryId): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): CategoryId {
        return new CategoryId( id )
    }

    private constructor(id:string){
        this.id=id
    }

}