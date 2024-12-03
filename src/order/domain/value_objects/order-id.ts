import { ValueObject } from "src/common/domain";
import { InvalidOrderIdException } from "../exception/invalid-order-id-exception";

export class OrderId extends ValueObject<OrderId> {
    private value: string;

    private constructor(value: string) {
        super();

        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(value)) { throw new InvalidOrderIdException()}

        this.value = value;
    }

    equals(obj: OrderId): boolean {
        return this.value == obj.value;
    }

    get orderId() {
        return this.value;
    }

    public static create(id: string): OrderId {
        return new OrderId(id);
    }
}