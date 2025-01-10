import { ValueObject } from "src/common/domain";
import { EmptyOrderCuponIdException } from "../exception/empty-order-cupon-id-exception";
import { InvalidOrderCuponIdException } from "../exception/invalid-order-cupon-id-exception";


export class OrderCuponId extends ValueObject<OrderCuponId> {
    private id: string;

    private constructor(id: string) {
        super();

        if(!id) throw new EmptyOrderCuponIdException();
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id))  throw new InvalidOrderCuponIdException();

        this.id = id;
    }

    equals(obj: OrderCuponId): boolean {
        return this.id == obj.id;
    }

    get cuponId() {
        return this.id;
    }

    public static create(id: string): OrderCuponId {
        return new OrderCuponId(id);
    }
}