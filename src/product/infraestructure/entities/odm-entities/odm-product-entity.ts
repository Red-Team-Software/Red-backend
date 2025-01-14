import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document, SchemaType, SchemaTypes } from "mongoose"
import { OdmCategory } from "src/category/infraestructure/entities/odm-entities/odm-category.entity"
import { IOdmProduct } from "../../model-entity/odm-model-entity/odm-product-interface"

@Schema({ collection: 'odmproduct' })
export class OdmProduct extends Document implements IOdmProduct {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: false, required: true })   
    name: string

    @Prop({ type: String, unique: false, required: true })   
    description: string

    @Prop({ type: [String], unique: false, required: true })   
    image: string[]

    @Prop({ type: Date, unique: false, required: false })   
    caducityDate?: Date

    @Prop({ type: Number, unique: false, required: true })   
    stock: number

    @Prop({ type: Number, unique: false, required: true })   
    price:number

    @Prop({ type: String, unique: false, required: true })   
    currency:string

    @Prop({ type: Number, unique: false, required: true })   
    weigth:number

    @Prop({ type: String, unique: false, required: true })   
    measurament:string

    @Prop({ 
        type: [
            {
                _id:false,
                id: SchemaTypes.UUID,
                name:SchemaTypes.String
            }
        ], 
        unique: false,
        required: false 
    })   
    category: {
        id:string,
        name:string
    }[]

}

export const OdmProductSchema = SchemaFactory.createForClass( OdmProduct )
