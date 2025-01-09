import { DomainEvent } from "src/common/domain";
import { CourierId } from "../value-objects/courier-id";
import { CourierName } from "../value-objects/courier-name";
import { CourierImage } from "../value-objects/courier-image";
import { CourierDirection } from "../value-objects/courier-direction";

export class CourierRegistered extends DomainEvent {
    
    serialize(): string {
        let data = {
            courierId: this.courierId.courierId,
            courierName: this.courierName.courierName,
            courierImage: this.courierImage.Value,
            courierDirection:{
                lat: this.courierDirection.Latitude,
                long: this.courierDirection.Longitude
            }
        }
        
        return JSON.stringify(data);
    }

    constructor(
        public courierId: CourierId,
        public courierName: CourierName,
        public courierImage:CourierImage,
        public courierDirection:CourierDirection
    ){
        super();
    }

    static create (
        id: CourierId,
        orderState: CourierName,
        orderUserId:CourierImage,
        courierDirection:CourierDirection
    ){
        let courier = new CourierRegistered(
            id,
            orderState,
            orderUserId,
            courierDirection
        );
        return courier;
    }
}