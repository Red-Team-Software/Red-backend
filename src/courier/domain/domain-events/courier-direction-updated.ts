import { DomainEvent } from "src/common/domain";
import { CourierId } from "../value-objects/courier-id";
import { CourierDirection } from "../value-objects/courier-direction";

export class CourierDirectionUpdated extends DomainEvent {
    
    serialize(): string {
        let data = {
            courierId: this.courierId.courierId,
            courierDirection:{
                lat: this.courierDirection.Latitude,
                long: this.courierDirection.Longitude
            }
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public courierId: CourierId,
        public courierDirection: CourierDirection
    ){
        super();
    }

    static create (
        id: CourierId,
        courierDirection:CourierDirection
    ){
        let courier = new CourierDirectionUpdated(
            id,
            courierDirection
        );
        return courier;
    }
}