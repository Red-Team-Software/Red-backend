import { AggregateRoot, DomainEvent } from "src/common/domain";
import { CuponId } from "../value-object/cupon-id";
import { CuponName } from "../value-object/cupon-name";
import { CuponCode } from "../value-object/cupon-code";
import { CuponDiscount } from "../value-object/cupon-discount";
import { CuponState } from "../value-object/cupon-state";
import { CuponCreated } from "../domain-events/cupon-created";
import { CuponDeleted } from "../domain-events/cupon-delete";
import { CuponStateChanged } from "../domain-events/cupon-state-change";
import { InvalidCuponException } from "../domain-exceptions/invalid-cupon-exception";

export class Cupon extends AggregateRoot<CuponId> {

    private constructor(
        cuponId: CuponId,
        private cuponName: CuponName,
        private cuponCode: CuponCode,
        private cuponDiscount: CuponDiscount,
        private cuponState: CuponState
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
        if (!this.getId() || 
            !this.cuponName || 
            !this.cuponCode || 
            !this.cuponDiscount || 
            !this.cuponState
            ) 
            throw new InvalidCuponException()
    }

    

    static registerCupon(
        cuponId: CuponId,
        cuponName: CuponName,
        cuponCode: CuponCode,
        cuponDiscount: CuponDiscount,
        cuponState: CuponState
    ): Cupon {
        const cupon = new Cupon(
            cuponId,
            cuponName,
            cuponCode,
            cuponDiscount,
            cuponState
        )
        cupon.apply(
            CuponRegistered.create(
                cuponId,
                cuponName,
                cuponCode,
                cuponDiscount,
                cuponState
            )
        );
        return cupon;
    }

    static initializeAggregate(
        cuponId: CuponId,
        cuponName: CuponName,
        cuponCode: CuponCode,
        cuponDiscount: CuponDiscount,
        cuponState: CuponState
    ): Cupon {
        const cupon = new Cupon(
            cuponId,
            cuponName,
            cuponCode,
            cuponDiscount,
            cuponState
        )
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
    
}
