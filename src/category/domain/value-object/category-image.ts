import { ValueObject } from 'src/common/domain/value-object/value-object';
import { InvalidCategoryImageException } from '../domain-exceptions/invalid-category-image-exception';

export class CategoryImage extends ValueObject<CategoryImage> {
    private readonly image: string

    equals(valueObject: CategoryImage): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.image }

    static create ( image: string ): CategoryImage {
        return new CategoryImage( image )
    }

    private constructor(image:string){
        super()
        const regex=new RegExp(/http?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp)/)
        if (!regex.test(image)) 
            throw new InvalidCategoryImageException()
        this.image=image
    }
}
