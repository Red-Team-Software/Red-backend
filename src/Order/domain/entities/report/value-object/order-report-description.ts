import { ValueObject } from "src/common/domain";
import { EmptyOrderReportDescriptionException } from "../exception/empty-order-report-description-exception";

export class OrderReportDescription implements ValueObject<OrderReportDescription> {

    private readonly description: string
    
    private constructor(description:string){
        if (description.length === 0) throw new EmptyOrderReportDescriptionException()
        this.description=description
    }


    equals(valueObject: OrderReportDescription): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.description }

    static create ( description: string ): OrderReportDescription {
        return new OrderReportDescription( description );
    }


}