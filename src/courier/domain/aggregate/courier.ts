import { AggregateRoot, DomainEvent } from "src/common/domain";
import { CourierId } from "../value-objects/courier-id";
import { CourierName } from "../value-objects/courier-name";
import { CourierImage } from "../value-objects/courier-image";
import { InvalidCourierException } from "../exceptions/invalid-courier-exception";


export class Courier extends AggregateRoot<CourierId>{
    
    protected when(event: DomainEvent): void {
        throw new Error("Method not implemented.");
    }
    protected validateState(): void {
        if(!this.courierName || !this.courierImage){
            new InvalidCourierException()
        };
    }

    private constructor (
        courierId: CourierId,
        private courierName: CourierName,
        private courierImage: CourierImage
    )
    {
        super(courierId)
    }

    static RegisterCourier(
        courierId: CourierId,
        courierName: CourierName,
        courierImage: CourierImage,
    ): Courier {
        const courier = new Courier(
            courierId,
            courierName,
            courierImage,
        )
        courier.validateState()
        return courier
    }

    static initializeAggregate(
        courierId: CourierId,
        courierName: CourierName,
        courierImage: CourierImage,
    ): Courier {
        const courier = new Courier(
            courierId,
            courierName,
            courierImage,
        )
        return courier
    }

    get CourierName(): CourierName {
        return this.courierName
    }

    get CourierImage(): CourierImage {
        return this.courierImage
    }
}