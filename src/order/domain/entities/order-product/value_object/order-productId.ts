import { ValueObject } from "src/common/domain";

export class OrderProductId extends ValueObject<OrderProductId> {
    private id: string;

    private constructor(id: string) {
        super();
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