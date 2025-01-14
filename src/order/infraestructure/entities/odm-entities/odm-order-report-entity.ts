import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IOdmOrderReport } from "../../model-entity/odm-model-entity/odm-report.interface"

@Schema()
export class OdmOrderReport extends Document implements IOdmOrderReport {

    @Prop({ type: String, unique: true, index: true, required: true }) 
    id: string

    @Prop({ type: String, unique: false, required: true })   
    description:string

}

export const OdmOrderReportSchema = SchemaFactory.createForClass( OdmOrderReport )