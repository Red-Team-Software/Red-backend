import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmCourier } from "../../model-entity/odm-model-entity/odm-courier-interface"
import { Document } from "mongoose"

@Schema({ collection: 'odmcourier' })
export class OdmCourier extends Document implements IOdmCourier {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: false, required: true })   
    name: string

    @Prop({ type: String, unique: false, required: true })   
    image: string

    @Prop({ type: String, unique: true, required: true })   
    email:string

    @Prop({ type: String, unique: true, required: true })   
    password:string

    @Prop({ type: Number, unique: false, required: true })
    latitude: number

    @Prop({ type: Number, unique: false, required: true })
    longitude: number

}

export const OdmCourierSchema = SchemaFactory.createForClass( OdmCourier )