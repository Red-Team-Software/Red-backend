import { ValueObject } from "src/common/domain"

export class CategoryId implements ValueObject<CategoryId> {

    private readonly id: string

    equals(valueObject: CategoryId): boolean {
        return this.Value===valueObject.Value
    }
    
    get Value(){ return this.id }

    static create ( id: string ): CategoryId {
        return new CategoryId( id )
    }

    private constructor(id:string){
        this.id=id
    }

}