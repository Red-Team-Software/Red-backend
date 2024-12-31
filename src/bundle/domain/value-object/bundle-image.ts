import { ValueObject } from "src/common/domain"
import { InvalidBundleImageException } from "../domain-exceptions/invalid-bundle-image-exception"

export class BundleImage implements ValueObject<BundleImage> {

    private readonly image: string

    equals(valueObject: BundleImage): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.image }

    static create ( image: string ): BundleImage {
        return new BundleImage( image )
    }

    private constructor(image:string){
        const regex=new RegExp(/http?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp)/)
        if (!regex.test(image))         
            throw new InvalidBundleImageException()
            this.image=image
    }

}