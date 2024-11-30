import { ValueObject } from "src/common/domain"
import { InvalidUserImageException } from "../domain-exceptions/invalid-user-image-exception"

export class UserImage implements ValueObject<UserImage> {

    private readonly image: string

    equals(valueObject: UserImage): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.image }

    static create ( image: string ): UserImage {
        
        const regex=new RegExp(/https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp)/)

        if(!regex.test(image))
            throw new InvalidUserImageException();

        return new UserImage( image )
    }

    private constructor(image:string){
        this.image=image
    }

}