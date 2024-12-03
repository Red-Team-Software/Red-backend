import { ValueObject } from "src/common/domain";
import { EmptyOrderDirectionStreetException } from "../exception/empty-order-direction-street.exception";

export class OrderAddressStreet extends ValueObject<OrderAddressStreet> {
    private address: string;


    private constructor(address: string) {
        super();

        if(!address)  throw new EmptyOrderDirectionStreetException() 

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