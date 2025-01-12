import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"
import { OdmCategory } from "src/category/infraestructure/entities/odm-entities/odm-category.entity"
import { IOdmPaymentMethod } from "../../model-entity/odm-model-entity/odm-payment-method-interface"

@Schema()
export class OdmPaymentMethod extends Document implements IOdmPaymentMethod {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: false, required: true })   
    name: string

    @Prop({ type: String, unique: false, required: true })   
    state: string

    @Prop({ type: String, unique: false, required: true })   
    imageUrl: string

}

export const OdmPaymentMethodSchema = SchemaFactory.createForClass( OdmPaymentMethod )
