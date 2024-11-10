import { ValueObject } from "src/common/domain";

export class OrderId extends ValueObject<OrderId> {
    private value: string;

    constructor(value: string) {
        super();

        //if(!value) { throw new EmptyOrderIdException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.value = value;
    }

    equals(obj: OrderId): boolean {
        return this.value == obj.value;
    }

    get OrderId() {
        return this.value;
    }

    public static create(id: string): OrderId {
        return new OrderId(id);
    }
}