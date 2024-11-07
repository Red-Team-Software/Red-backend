import { ValueObject } from "src/common/domain"
import { InvalidProductImageException } from "../domain-exceptions/invalid-product-image-exception"

export class ProductImage implements ValueObject<ProductImage> {

    private readonly image: string

    equals(valueObject: ProductImage): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.image }

    static create ( image: string ): ProductImage {
        return new ProductImage( image )
    }

    private constructor(image:string){
        if (image.length<5) throw new InvalidProductImageException()
        this.image=image
    }

}