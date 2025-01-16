import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"
import { IOdmCoupon } from "../../model-entity/odm-model-entities/odm-coupon.interface"

@Schema({ collection: 'odmcoupon' })
export class OdmCoupon extends Document implements IOdmCoupon {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: true, required: true })   
    name: string

    @Prop({ type: String, unique: true, required: true })   
    code: string

    @Prop({ type: Number, unique: false, required: true })  
    discount: number

    @Prop({ type: String, unique: false, required: true })  
    state: string
    
}

export const OdmCouponSchema = SchemaFactory.createForClass( OdmCoupon )