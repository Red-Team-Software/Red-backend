import { ValueObject } from "src/common/domain"
import { InvalidCategoryIdException } from "../domain-exceptions/invalid-category-id-exception"

export class CategoryID implements ValueObject<CategoryID> {

    private readonly id: string

    equals(valueObject: CategoryID): boolean {
        return this.Value===valueObject.Value
    }
    
    get Value(){ return this.id }

    static create ( id: string ): CategoryID {
        return new CategoryID( id )
    }

    private constructor(id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidCategoryIdException() }
        this.id=id
    }

}