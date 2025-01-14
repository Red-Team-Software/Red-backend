import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmProductDetails } from "../../model-entity/odm-model-entity/odm-product-details.interface"
import { Types } from "mongoose";
import { OdmProduct } from "src/product/infraestructure/entities/odm-entities/odm-product-entity";

@Schema()
export class OdmProductDetail extends Document implements IOdmProductDetails {
    
    @Prop({ type: Types.ObjectId, ref: 'OdmProduct', required: false })
    id?: OdmProduct;

    @Prop({ type: Number, unique: false, required: true })   
    quantity: number

    @Prop({ type: Number, unique: false, required: true })   
    price: number

    @Prop({ type: String, unique: false, required: true })   
    currency:string

}

export const OdmProductDetailSchema = SchemaFactory.createForClass( OdmProductDetail )