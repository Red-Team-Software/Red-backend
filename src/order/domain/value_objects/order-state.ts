import { ValueObject } from "src/common/domain";
import { InvalidOrderStateException } from "../exception/invalid-order-state-exception";
import { OrderStateEnum } from "./enum/order-enum-state";
import { ErrorOrderAlreadyCancelledException } from "../exception/order-already-cancelled.exception";

export class OrderState extends ValueObject<OrderState> {
    private state: string;

    private constructor(state: string) {
        super();

        if( OrderStateEnum.delivered != state 
            && OrderStateEnum.ongoing != state 
            && OrderStateEnum.cancelled != state 
            && OrderStateEnum.waiting != state
            && OrderStateEnum.delivering != state
        ) { throw new InvalidOrderStateException()}  

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

    changeStateCancelled(): OrderState {
        if (this.state === 'cancelled') {
            throw new ErrorOrderAlreadyCancelledException("The order is already cancelled");
        }
        return new OrderState('cancelled');
    }

    changeStateDelivered(): OrderState {
        if (this.state === 'cancelled') {
            throw new ErrorOrderAlreadyCancelledException("Can't deliver a cancelled order");
        }
        return new OrderState('delivered');
    }

    changeStateDelivering(): OrderState {
        if (this.state === 'cancelled') {
            throw new ErrorOrderAlreadyCancelledException("Can't deliver a cancelled order");
        }
        return new OrderState('delivering');
    }
}