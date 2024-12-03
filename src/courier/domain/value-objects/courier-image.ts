import { ValueObject } from "src/common/domain"
import { InvalidCourierImageException } from "../exceptions/invalid-courier-image-exception"

export class CourierImage implements ValueObject<CourierImage> {

    private readonly image: string

    private constructor(image:string){
        if (image.length<5) throw new InvalidCourierImageException()
        this.image=image
    }
    equals(valueObject: CourierImage): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ 
        return this.image 
    }

    static create ( image: string ): CourierImage {
        return new CourierImage( image )
    }

    
}