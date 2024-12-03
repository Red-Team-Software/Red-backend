import { ValueObject } from "src/common/domain"
import { InvalidPaymentMethodImageException } from "../exceptions/invalid-payment-method-image-exception"

export class PaymentMethodImage implements ValueObject<PaymentMethodImage> {

    private readonly image: string

    private constructor(image:string){
        if (image.length<5) throw new InvalidPaymentMethodImageException()
        this.image=image
    }
    equals(valueObject: PaymentMethodImage): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ 
        return this.image 
    }

    static create ( image: string ): PaymentMethodImage {
        return new PaymentMethodImage( image )
    }

    
}