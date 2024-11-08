import { ValueObject } from "src/common/domain"

export class CategoryID implements ValueObject<CategoryID> {

    private readonly id: string

    equals(valueObject: CategoryID): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.id }

    static create ( id: string ): CategoryID {
        return new CategoryID( id )
    }

    private constructor(id:string){
        this.id=id
    }

}