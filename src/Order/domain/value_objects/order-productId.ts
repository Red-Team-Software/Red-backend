import { ValueObject } from "src/common/domain";

export class OrderProductId extends ValueObject<OrderProductId> {
    private id: string;

    constructor(id: string) {
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

    public static create(id: string): OrderProductId {
        return new OrderProductId(id);
    }
}