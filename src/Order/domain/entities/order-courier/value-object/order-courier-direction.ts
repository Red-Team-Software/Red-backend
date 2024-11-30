import { ValueObject } from "src/common/domain";
import { EmptyOrderCourierDirectionLongitudeException } from "../exception/empty-order-courier-direction-longitude-exception";
import { EmptyOrderCourierDirectionLatitudeException } from "../exception/empty-order-courier-direction-latitude-exception";
import { BadFormatOrderCourierDirectionLatitudeException } from "../exception/bad-format-order-courier-direction-latitude-exception";
import { BadFormatOrderCourierDirectionLongitudeException } from '../exception/bad-format-order-courier-direction-longitude-exception';


export class OrderCourierDirection extends ValueObject<OrderCourierDirection> {
    private lat: number;
    private long: number;


    private constructor(lat: number, long: number) {
        super();

        if (!lat) throw new EmptyOrderCourierDirectionLatitudeException()
        if (!long) throw new EmptyOrderCourierDirectionLongitudeException()

        //if (typeof lat !== 'number') throw new BadFormatOrderCourierDirectionLatitudeException()
        //if (typeof long !== 'number') throw new BadFormatOrderCourierDirectionLongitudeException()

        this.long = long;
        this.lat = lat;
    }

    equals(obj: OrderCourierDirection): boolean {
        if (obj.lat == this.lat && obj.long == this.long) return true;
        return false;
    }

    get Latitude() {
        return this.lat;
    }

    get Longitude() {
        return this.long;
    }

    public static create(lat: number, long: number): OrderCourierDirection {
        return new OrderCourierDirection(lat, long);
    }
}