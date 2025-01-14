import { ValueObject } from "src/common/domain";
import { BadFormatCourierDirectionLatitudeException } from "../exceptions/bad-format-courier-direction-latitude.exception";
import { BadFormatCourierDirectionLongitudeException } from "../exceptions/bad-format-courier-direction-longitude.exception";

export class CourierDirection extends ValueObject<CourierDirection> {
    private lat: number;
    private long: number;


    private constructor(lat: number, long: number) {
        super();

        if (typeof lat !== 'number') throw new BadFormatCourierDirectionLatitudeException()
        if (typeof long !== 'number') throw new BadFormatCourierDirectionLongitudeException()

        this.long = long;
        this.lat = lat;
    }

    equals(obj: CourierDirection): boolean {
        if (obj.lat == this.lat && obj.long == this.long) return true;
        return false;
    }

    get Latitude() {
        return this.lat;
    }

    get Longitude() {
        return this.long;
    }

    public static create(lat: number, long: number): CourierDirection {
        return new CourierDirection(lat, long);
    }
}