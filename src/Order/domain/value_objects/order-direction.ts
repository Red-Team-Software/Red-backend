import { ValueObject } from "src/common/domain";

export class OrderDirection extends ValueObject<OrderDirection> {
    private lat: number;
    private long: number;


    constructor(lat: number, long: number) {
        super();
 
        //if(!lat) { throw new EmptyOrderDirectionException('No se pudo obtener un Lat de curso') /* throw DomainException NullCourseLat */}

        this.long = long;
        this.lat = lat;
    }

    equals(obj: OrderDirection): boolean {
        if (obj.lat == this.lat && obj.long == this.long) return true;
        return false;
    }

    get OrderDirection() {
        return this.lat;
    }

    public static create(lat: number, long: number): OrderDirection {
        return new OrderDirection(lat, long);
    }
}