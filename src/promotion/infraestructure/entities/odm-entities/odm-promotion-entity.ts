import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import { PromotionStateEnum } from 'src/promotion/domain/value-object/enum/promotion-state.enum';
import { IOdmModelPromotion } from '../../model-entity/odm-model-entity/odm-promotion-interface';
import { OdmProduct } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';
import { OdmBundle } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';

@Schema({ collection: 'odmpromotions' })
export class OdmPromotionEntity extends Document implements IOdmModelPromotion{
    @Prop({ type: String, required: true, unique: true })
    id: string;

    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, enum: PromotionStateEnum, required: true })
    state: string;

    @Prop({ type: Number, required: true })
    discount: number;
    
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

export const OdmPromotionSchema = SchemaFactory.createForClass(OdmPromotionEntity);