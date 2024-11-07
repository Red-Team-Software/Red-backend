import { ValueObject } from "src/common/domain"
import { InvalidProductStockException } from "../domain-exceptions/invalid-product-stock-exception"

export class ProductStock implements ValueObject<ProductStock> {

    private readonly stock: number

    equals(valueObject: ProductStock): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.stock }

    static create ( stock: number ): ProductStock {
        return new ProductStock( stock )
    }

    private constructor(stock:number){
        if (stock<0) throw new InvalidProductStockException()
        this.stock=stock
    }

}