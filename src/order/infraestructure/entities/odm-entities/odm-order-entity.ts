import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmOrderModel } from "../../model-entity/odm-model-entity/odm-order.interface"
import { OdmProductDetail } from "./odm-product-detail-entity"
import { OdmOrderPayment } from "./odm-order-payment-entity"
import { OdmOrderReport } from "./odm-order-report-entity"
import { OdmBundleDetail } from "./odm-bundle-detail-entity"
import { Types } from "mongoose";

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

    @Prop({ type: String, unique: false, required: true })   
    courierId:string

    @Prop({ type: OdmOrderPayment, required: false })
    orderPayment: OdmOrderPayment;

    @Prop({ type: [OdmProductDetail], required: false })
    productDetails?: OdmProductDetail[];

    @Prop({ type: [OdmBundleDetail], required: false })
    bundleDetails?: OdmBundleDetail[];

    @Prop({ type: OdmOrderReport, required: false })
    orderReport?: OdmOrderReport;

    // @Prop({ type: Types.ObjectId, ref: 'OrderPayment', required: false })
    // orderPayment?: OdmOrderPayment;

}

export const OdmOrderSchema = SchemaFactory.createForClass( OdmOrder )