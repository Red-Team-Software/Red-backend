import { ValueObject } from "src/common/domain";
import { InvalidOrderUserIdException } from "../exception/invalid-order-user-id-exception";

export class OrderUserId extends ValueObject<OrderUserId> {
    private id: string;

    private constructor(id: string) {
        super();

        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidOrderUserIdException()}

        this.id = id;
    }

    equals(obj: OrderUserId): boolean {
        return this.id == obj.id;
    }

    get userId() {
        return this.id;
    }

    public static create(id: string): OrderUserId {
        return new OrderUserId(id);
    }
}