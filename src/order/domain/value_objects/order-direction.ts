import { ValueObject } from "src/common/domain";
import { BadFormatOrderDirectionLatitudeException } from "../exception/bad-format-order-direction-latitude.exception";
import { BadFormatOrderDirectionLongitudeException } from "../exception/bad-format-order-direction-longitude.exception";
import { EmptyOrderDirectionLatitudeException } from "../exception/empty-order-direction-latitude.exception";
import { EmptyOrderDirectionLongitudeException } from "../exception/empty-order-direction-longitude.exception";

export class OrderDirection extends ValueObject<OrderDirection> {
    private lat: number;
    private long: number;


    private constructor(lat: number, long: number) {
        super();

        if (!lat) throw new EmptyOrderDirectionLatitudeException()
        if (!long) throw new EmptyOrderDirectionLongitudeException()

        if (typeof lat !== 'number') throw new BadFormatOrderDirectionLatitudeException()
        if (typeof long !== 'number') throw new BadFormatOrderDirectionLongitudeException()

        this.long = long;
        this.lat = lat;
    }

    equals(obj: OrderDirection): boolean {
        if (obj.lat == this.lat && obj.long == this.long) return true;
        return false;
    }

    get Latitude() {
        return this.lat;
    }

    get Longitude() {
        return this.long;
    }

    public static create(lat: number, long: number): OrderDirection {
        return new OrderDirection(lat, long);
    }
}