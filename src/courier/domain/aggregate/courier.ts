import { AggregateRoot, DomainEvent } from "src/common/domain";
import { CourierId } from "../value-objects/courier-id";
import { CourierName } from "../value-objects/courier-name";
import { CourierImage } from "../value-objects/courier-image";
import { InvalidCourierException } from "../exceptions/invalid-courier-exception";
import { CourierRegistered } from "../domain-events/courier-registered";
import { CourierDirection } from '../value-objects/courier-direction';
import { CourierDirectionUpdated } from "../domain-events/courier-direction-updated";


export class Courier extends AggregateRoot<CourierId>{
    
    protected when(event: DomainEvent): void {
        if (event instanceof CourierRegistered) {
            this.courierName = event.courierName;
            this.courierImage = event.courierImage;
            this.courierDirection = event.courierDirection;
        };
        if (event instanceof CourierDirectionUpdated) {
            this.courierDirection = event.courierDirection;
        };

    }
    protected validateState(): void {
        if(!this.courierName || !this.courierImage || !this.courierDirection){
            new InvalidCourierException()
        };
    }

    private constructor (
        courierId: CourierId,
        private courierName: CourierName,
        private courierImage: CourierImage,
        private courierDirection: CourierDirection
    )
    {
        super(courierId)
    }

    static RegisterCourier(
        courierId: CourierId,
        courierName: CourierName,
        courierImage: CourierImage,
        courierDirection: CourierDirection
    ): Courier {
        const courier = new Courier(
            courierId,
            courierName,
            courierImage,
            courierDirection
        )
        courier.apply(
            new CourierRegistered(
                courierId,
                courierName,
                courierImage,
                courierDirection
            )
        );
        return courier;
    }

    static initializeAggregate(
        courierId: CourierId,
        courierName: CourierName,
        courierImage: CourierImage,
        courierDirection: CourierDirection
    ): Courier {
        const courier = new Courier(
            courierId,
            courierName,
            courierImage,
            courierDirection
        )
        courier.validateState();
        return courier;
    }

    updateLocation(courierDirection: CourierDirection): void {
        this.apply(
            new CourierDirectionUpdated(
                this.getId(),
                courierDirection
            )
        );
    }

    get CourierName(): CourierName {
        return this.courierName;
    }

    get CourierImage(): CourierImage {
        return this.courierImage;
    }

    get CourierDirection(): CourierDirection{
        return this.courierDirection;
    }
}