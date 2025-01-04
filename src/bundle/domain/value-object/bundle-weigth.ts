import { ValueObject } from "src/common/domain"
import { InvalidBundleWeigthException } from "../domain-exceptions/invalid-bundle-weigth-exception"
import { BundleMeasurementEnum } from "./enums/bundle-measurament.enum"
import { InvalidBundleMeasurementException } from "../domain-exceptions/invalid-bundle-measurement-exception"

export class BundleWeigth implements ValueObject<BundleWeigth> {

    private readonly weigth: number
    private readonly measure:string

    equals(valueObject: BundleWeigth): boolean {
        if (this.Weigth===valueObject.Weigth && 
            this.Measure===valueObject.Measure
        ) return true
        return false
    }
    
    get Weigth(){ return this.weigth }
    get Measure(){ return this.measure }


    static create ( weigth: number, measure:string): BundleWeigth {
        return new BundleWeigth( weigth,measure)
    }

    private constructor(weigth:number,measure:string){
        measure=measure.toLowerCase()
        if (weigth<0) throw new InvalidBundleWeigthException()
            
        if ( 
            BundleMeasurementEnum.g != measure &&
            BundleMeasurementEnum.kg != measure &&
            BundleMeasurementEnum.mg != measure
        ) throw new InvalidBundleMeasurementException()

        this.weigth=weigth
        this.measure=measure
    }

}