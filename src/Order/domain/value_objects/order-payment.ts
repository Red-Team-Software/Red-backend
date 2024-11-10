import { ValueObject } from "src/common/domain";

export class OrderPayment extends ValueObject<OrderPayment> {
    private amount: number;
    private currency: string;
    private paymentMethod: string;

    constructor(amount: number, currency: string, paymentMethod: string) {
        super();
 
        //if(!amount) { throw new EmptyOrderPaymentException('No se pudo obtener un Id de curso') /* throw DomainException NullCourseId */}

        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
    }

    equals(obj: OrderPayment): boolean {
        return this.amount == obj.amount;
    }

    get Amount():number {
        return this.amount;
    }

    get Currency():string {
        return this.currency;
    }

    get PaymentMethod():string {
        return this.paymentMethod;
    }

    public static create(amount: number, currency: string, paymentMethod: string): OrderPayment {
        return new OrderPayment(amount, currency, paymentMethod);
    }
}