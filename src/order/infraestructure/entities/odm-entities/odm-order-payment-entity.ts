import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmOrderPayment } from "../../model-entity/odm-model-entity/odm-order-payment.interface"

@Schema()
export class OdmOrderPayment extends Document implements IOdmOrderPayment {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: Number, unique: false, required: true })   
    amount: number

    @Prop({ type: String, unique: false, required: true })   
    currency:string
    
    @Prop({ type: String, unique: false, required: true })   
    paymentMethod: string

}

export const OdmOrderPaymentSchema = SchemaFactory.createForClass( OdmOrderPayment )