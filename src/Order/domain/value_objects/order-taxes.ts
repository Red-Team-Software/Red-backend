import { ValueObject } from "src/common/domain";

export class OrderTaxes extends ValueObject<OrderTaxes> {
    private tax: number;

    constructor(tax: number) {
        super();
 
        //if(!tax) { throw new EmptyOrderTaxesException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

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