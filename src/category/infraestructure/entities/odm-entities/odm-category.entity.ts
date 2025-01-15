import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"
import { IOdmCategory } from "../../model-entities/odm-model-entities/odm-category.interface"

@Schema({ collection: 'odmcategory' })
export class OdmCategory extends Document implements IOdmCategory {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: true, required: true })   
    name: string

    @Prop({ type: String, unique: false, required: true })   
    image: string

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
    bundles: {
        id:string,
        name:string
    }[]
    
    
}

export const OdmProductCategorySchema = SchemaFactory.createForClass( OdmCategory )
