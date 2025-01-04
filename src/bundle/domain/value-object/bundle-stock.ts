import { ValueObject } from "src/common/domain"
import { InvalidBundleStockException } from "../domain-exceptions/invalid-bundle-stock-exception"

export class BundleStock implements ValueObject<BundleStock> {

    private readonly stock: number

    equals(valueObject: BundleStock): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.stock }

    static create ( stock: number ): BundleStock {
        return new BundleStock( stock )
    }

    private constructor(stock:number){
        if (stock<0) throw new InvalidBundleStockException()
        this.stock=stock
    }

    reduceStock(quantity:number){
        return new BundleStock(this.stock-quantity)
    }

}