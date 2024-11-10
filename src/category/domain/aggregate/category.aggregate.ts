import { AggregateRoot, DomainEvent } from "src/common/domain";
import { CategoryID } from "../value-object/category-id";

export class Category extends AggregateRoot <CategoryID>{

    protected when(event: DomainEvent): void {
        // reacciona al evento de dominio
    }
    protected validateState(): void {
        // valida que todos los v.o entities que tengan esten bien
    }

}