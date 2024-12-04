import { ValueObject } from "src/common/domain";
import { EmptyOrderCourierIdException } from "../exception/empty-order-courier-id-exception";
import { InvalidOrderCourierIdException } from "../exception/invalid-order-courier-id-exception";


export class OrderCourierId extends ValueObject<OrderCourierId> {
    private id: string;

    private constructor(id: string) {
        super();

        if(!id) throw new EmptyOrderCourierIdException();
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id))  throw new InvalidOrderCourierIdException();

        this.id = id;
    }

    equals(obj: OrderCourierId): boolean {
        return this.id == obj.id;
    }

    get OrderCourierId() {
        return this.id;
    }

    public static create(id: string): OrderCourierId {
        return new OrderCourierId(id);
    }
}