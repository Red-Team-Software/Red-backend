import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmBundleDetails } from "../../model-entity/odm-model-entity/odm-bundle-details.interface"
import { Types } from "mongoose";
import { OdmBundle } from "src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity";

@Schema()
export class OdmBundleDetail extends Document implements IOdmBundleDetails {

    @Prop({ type: Types.ObjectId, ref: 'OdmBundle', required: true })
    id: OdmBundle;

    @Prop({ type: Number, unique: false, required: true })   
    quantity: number

    @Prop({ type: Number, unique: false, required: true })   
    price: number

    @Prop({ type: String, unique: false, required: true })   
    currency:string



}

export const OdmBundleDetailSchema = SchemaFactory.createForClass( OdmBundleDetail )