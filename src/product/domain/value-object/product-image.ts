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
        const regex=new RegExp(/http?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp)/)
        if (!regex.test(image)) 
            throw new InvalidProductImageException()
        this.image=image
    }

}