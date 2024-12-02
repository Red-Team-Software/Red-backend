// src/category/domain/value-object/category-image.ts

import { ValueObject } from 'src/common/domain/value-object/value-object';

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
        this.image=image
    }
}
