import { ValueObject } from "src/common/domain";
import { ProductID } from "src/product/domain/value-object/product-id";

export class OrderProductId extends ValueObject<OrderProductId> {
    private id: ProductID;

    private constructor(id: ProductID) {
        super();
 
        //if(!id) { throw new EmptyOrderProductIdException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.id = id;
    }

    equals(obj: OrderProductId): boolean {
        return this.id == obj.id;
    }

    get OrderProductId() {
        return this.id;
    }

    public static create(id: ProductID): OrderProductId {
        return new OrderProductId(id);
    }
}