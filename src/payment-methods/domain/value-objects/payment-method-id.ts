import { ValueObject } from "src/common/domain"
import { InvalidPaymentMethodIdException } from "../exceptions/invalid-payment-method-id-exception";

export class PaymentMethodId extends ValueObject<PaymentMethodId> {
    private id: string;

    private constructor(id: string) {
        super();

        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidPaymentMethodIdException()}

        this.id = id;
    }

    equals(obj: PaymentMethodId): boolean {
        return this.id == obj.id;
    }

    get paymentMethodId() {
        return this.id;
    }

    public static create(id: string): PaymentMethodId {
        return new PaymentMethodId(id);
    }
}