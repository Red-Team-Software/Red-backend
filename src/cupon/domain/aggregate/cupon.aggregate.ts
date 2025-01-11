import { AggregateRoot, DomainEvent } from "src/common/domain";
import { CuponId } from "../value-object/cupon-id";
import { CuponName } from "../value-object/cupon-name";
import { CuponCode } from "../value-object/cupon-code";
import { CuponDiscount } from "../value-object/cupon-discount";
import { CuponState } from "../value-object/cupon-state";
import { CuponCreated } from "../domain-events/cupon-created";
import { CuponDeleted } from "../domain-events/cupon-delete";
import { CuponStateChanged } from "../domain-events/cupon-state-change";
import { CuponUser } from "../entities/cuponUser/cuponUser.entity";

export class Cupon extends AggregateRoot<CuponId> {

    private constructor(
        cuponId: CuponId,
        private cuponName: CuponName,
        private cuponCode: CuponCode,
        private cuponDiscount: CuponDiscount,
        private cuponState: CuponState,
        private users?: CuponUser[]
    ) {
        super(cuponId);
    }
    
    protected when(event: DomainEvent): void {
        switch (event.getEventName) {
            case "CuponCreated":
                const cuponCreated: CuponCreated = event as CuponCreated;
                this.cuponName = cuponCreated.cuponName;
                this.cuponCode = cuponCreated.cuponCode;
                this.cuponDiscount = cuponCreated.cuponDiscount;
                this.cuponState = cuponCreated.cuponState;
                this.users=cuponCreated.users;
                break;

            case "CuponStateChange":
                const stateChanged: CuponStateChanged = event as CuponStateChanged;
                this.cuponState = stateChanged.newState;
                break;

            case "CuponDelete":
                // Event-specific logic if needed
                break;
        }
    }

    protected validateState(): void {
        if (!this.getId() || !this.cuponName || !this.cuponCode || !this.cuponDiscount || !this.cuponState) {
            throw new Error("Invalid cupon state: All properties must be defined.");
        }
    }

    

    static registerCupon(
        cuponId: CuponId,
        cuponName: CuponName,
        cuponCode: CuponCode,
        cuponDiscount: CuponDiscount,
        cuponState: CuponState,
        users?:CuponUser[]
    ): Cupon {
        const cupon = new Cupon(cuponId, cuponName, cuponCode, cuponDiscount, cuponState, users);
        cupon.apply(
            CuponCreated.create(cuponId, cuponName, cuponCode, cuponDiscount, cuponState, users)
        );
        return cupon;
    }

    static initializeAggregate(
        cuponId: CuponId,
        cuponName: CuponName,
        cuponCode: CuponCode,
        cuponDiscount: CuponDiscount,
        cuponState: CuponState,
        users:CuponUser[]
    ): Cupon {
        const cupon = new Cupon(cuponId, cuponName, cuponCode, cuponDiscount, cuponState, users);
        cupon.validateState();
        return cupon;
    }

    changeState(newState: CuponState): void {
        if (!this.cuponState.equals(newState)) {
            this.cuponState = newState;
            this.apply(CuponStateChanged.create(this.getId(), newState));
        }
    }

    deleteCupon(): void {
        this.apply(CuponDeleted.create(this.getId()));
    }

    // Getters for accessing value objects
    get CuponName(): CuponName {
        return this.cuponName;
    }

    get CuponCode(): CuponCode {
        return this.cuponCode;
    }

    get CuponDiscount(): CuponDiscount {
        return this.cuponDiscount;
    }

    get CuponState(): CuponState {
        return this.cuponState;
    }
    
    get CuponUsers(): CuponUser[] {
        return this.users
    }
}
