import { ValueObject } from "src/common/domain";
import { InvalidOrderStateException } from "../exception/invalid-order-state-exception";
import { OrderStateEnum } from "./enum/order-enum-state";

export class OrderState extends ValueObject<OrderState> {
    private state: string;

    private constructor(state: string) {
        super();

        if( OrderStateEnum.delivered != state 
            && OrderStateEnum.ongoing != state 
            && OrderStateEnum.canceled != state 
            && OrderStateEnum.waiting != state
        ) { throw new InvalidOrderStateException('El estado proporcionado no es un estado de orden')}  

        this.state = state;
    }

    equals(obj: OrderState): boolean {
        return this.state == obj.state;
    }

    get orderState() {
        return this.state;
    }

    public static create(state: string): OrderState {
        return new OrderState(state);
    }
}