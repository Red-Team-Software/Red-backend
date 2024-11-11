import { ValueObject } from "src/common/domain"
import { InvalidProductWeigthException } from "../domain-exceptions/invalid-product-weigth-exception"
import { InvalidProductMeasurementException } from "../domain-exceptions/invalid-product-measurement-exception"
import { ProductMeasurementEnum } from "./enums/product-measurament.enum"

export class ProductWeigth implements ValueObject<ProductWeigth> {

    private readonly weigth: number
    private readonly measure:string

    equals(valueObject: ProductWeigth): boolean {
        if (this.Weigth===valueObject.Weigth && 
            this.Measure===valueObject.Measure
        ) return true
        return false
    }
    
    get Weigth(){ return this.weigth }
    get Measure(){ return this.measure }


    static create ( weigth: number, measure:string): ProductWeigth {
        return new ProductWeigth( weigth,measure)
    }

    private constructor(weigth:number,measure:string){
        measure=measure.toLowerCase()
        if (weigth<0) throw new InvalidProductWeigthException()
            
        if ( 
            ProductMeasurementEnum.g != measure &&
            ProductMeasurementEnum.kg != measure &&
            ProductMeasurementEnum.mg != measure
        ) throw new InvalidProductMeasurementException()

        this.weigth=weigth
        this.measure=measure
    }

}