import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { IOdmCategory } from "../../model-entities/odm-model-entities/odm-category.interface"

@Schema()
export class OdmCategory extends Document implements IOdmCategory {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: true, required: true })   
    name: string

    @Prop({ type: String, unique: false, required: true })   
    image: string
    
}

export const OdmProductCategorySchema = SchemaFactory.createForClass( OdmCategory )
