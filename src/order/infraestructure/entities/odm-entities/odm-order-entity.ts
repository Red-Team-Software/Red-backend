import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmOrderModel } from "../../model-entity/odm-model-entity/odm-order.interface"
import { OdmProductDetail } from "./odm-product-detail-entity"
import { OdmBundleDetail } from "./odm-bundle-detail-entity"
import { SchemaTypes, Types } from "mongoose";

@Schema()
export class OdmOrder extends Document implements IOdmOrderModel {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: false, required: true })   
    state: string

    @Prop({ type: Date, unique: false, required: true })   
    createdDate: Date

    @Prop({ type: Number, unique: false, required: true })   
    totalAmount: number

    @Prop({ type: String, unique: false, required: true })   
    currency:string

    @Prop({ type: Number, unique: false, required: true })   
    latitude: number

    @Prop({ type: Number, unique: false, required: true })   
    longitude:number

    @Prop({ type: Date, unique: false, required: false })   
    receivedDate?: Date

    //! No se si hay que hacerles refencia
    @Prop({ type: String, unique: false, required: false })   
    courier_id?:string

    @Prop({ type: String, unique: false, required: false })   
    coupon_id?:string

    @Prop({ 
        type: [
            {
                _id: false,
                id: SchemaTypes.UUID,
                amount: SchemaTypes.Number,
                currency: SchemaTypes.String,
                paymentMethod: SchemaTypes.String
            }
        ], 
        required: true 
    })
    order_payment: {
        id: string,
        amount: number,
        currency: string,
        paymentMethod: string
    };

    @Prop({ type: [OdmProductDetail], required: false })
    product_details?: OdmProductDetail[];

    @Prop({ type: [OdmBundleDetail], required: false })
    bundle_details?: OdmBundleDetail[];

    @Prop({ 
        type: [
            {
                _id: false,
                id: SchemaTypes.UUID,
                description: SchemaTypes.String
            }
        ], required: false 
    })
    report?: {
        id: string,
        description: string
    };

    // @Prop({ type: Types.ObjectId, ref: 'OrderPayment', required: false })
    // orderPayment?: OdmOrderPayment;

}

export const OdmOrderSchema = SchemaFactory.createForClass( OdmOrder )