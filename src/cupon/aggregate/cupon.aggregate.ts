import { AggregateRoot, DomainEvent } from "src/common/domain";
import { CuponId } from "../domain/value-object/cupon-id";
import { CuponCode } from "../domain/value-object/cupon-code";
import { CuponName} from "../domain/value-object/cupon-name";
import { CuponState } from "../domain/value-object/cupon-state";
import { CuponDiscount } from "../domain/value-object/cupon-discount";
import { CuponRegistered } from "../domain/domain-events/cupon-created";
import { CuponStateChanged } from "../domain/domain-events/cupon-state-change";
export class Cupon extends AggregateRoot <CuponId>{

    private constructor(
        cuponId: CuponId,
        private cuponName: CuponName,
        private cuponCode: CuponCode,
        private cuponDiscount: CuponDiscount,
        private cuponState: CuponState
    ) {
        super(cuponId);
    }

    protected when(event:DomainEvent):void{
        switch (event.getEventName) {
            case "CuponRegistered":
                const cuponRegistered: CuponRegistered = event as CuponRegistered;
                this.cuponName = cuponRegistered.cuponName;
                this.cuponCode = cuponRegistered.cuponCode;
                this.cuponDiscount = cuponRegistered.cuponDiscount;
                this.cuponState = cuponRegistered.cuponState;
                break;

            case "CuponStateChange":
                const stateChanged: cuponStateChange = event as CuponStateChange;
                this.cuponState = stateChanged.newState;
                break;

            case "CuponDelete":
                // Event-specific logic if needed
                break;
        }
    }
}