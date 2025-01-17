import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document, SchemaTypes } from "mongoose"
import { IOdmBundle } from "../../model-entity/odm-model-entity/odm-bundle-interface"

@Schema({ collection: 'odmbundle' })
export class OdmBundle extends Document implements IOdmBundle {

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
                id: SchemaTypes.String,
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


    @Prop({ 
        type: [
            {
                _id:false,
                id: SchemaTypes.String,
                name:SchemaTypes.String
            }
        ], 
        unique: false,
        required: false 
    })   
    products: {
        id:string,
        name:string
    }[]
}

export const OdmBundleSchema = SchemaFactory.createForClass( OdmBundle )
