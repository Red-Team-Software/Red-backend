import { ValueObject } from "src/common/domain";

export class OrderState extends ValueObject<OrderState> {
    private state: string;

    constructor(state: string) {
        super();
 
        //if(!state) { throw new EmptyOrderStateException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.state = state;
    }

    equals(obj: OrderState): boolean {
        return this.state == obj.state;
    }

    get OrderState() {
        return this.state;
    }

    public static create(state: string): OrderState {
        return new OrderState(state);
    }
}