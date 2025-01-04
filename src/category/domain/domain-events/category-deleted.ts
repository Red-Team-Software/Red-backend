import { DomainEvent } from '../../../common/domain/domain-event/domain-event';
import { CategoryID } from '../value-object/category-id';

export class CategoryDeleted extends DomainEvent {
    
    static create(
        categoryId: CategoryID
    ){
        return new CategoryDeleted(
            categoryId
        )
    }
    constructor(
        public categoryId: CategoryID
    ){
        super()
    }
    
    serialize(): string {
        let data= {  
            categoryId:this.categoryId.Value
        }
        
        return JSON.stringify(data)
    }
}