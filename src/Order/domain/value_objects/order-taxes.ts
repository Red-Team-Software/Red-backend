import { ValueObject } from "src/common/domain";
import { NegativeOrderTaxException } from "../exception/negative-order-tax-exception";

export class OrderTaxes extends ValueObject<OrderTaxes> {
    private tax: number;

    constructor(tax: number) {
        super();

        if(tax<0) { throw new NegativeOrderTaxException('Los taxes de la orden no puede ser negativos')}


        this.tax = tax;
    }

    equals(obj: OrderTaxes): boolean {
        return this.tax == obj.tax;
    }

    get OrderTaxes() {
        return this.tax;
    }

    public static create(tax: number): OrderTaxes {
        return new OrderTaxes(tax);
    }
}