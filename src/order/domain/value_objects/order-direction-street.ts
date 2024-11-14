import { ValueObject } from "src/common/domain";

export class OrderAddressStreet extends ValueObject<OrderAddressStreet> {
    private address: string;


    private constructor(address: string) {
        super();
 
        //if(!lat) { throw new EmptyOrderAddressStreetException('No se pudo obtener un Lat de curso') /* throw DomainException NullCourseLat */}

        this.address = address;
    }

    equals(obj: OrderAddressStreet): boolean {
        return obj.address === this.address;
    }

    get Address() {
        return this.address;
    }


    public static create(address: string): OrderAddressStreet {
        return new OrderAddressStreet(address);
    }
}