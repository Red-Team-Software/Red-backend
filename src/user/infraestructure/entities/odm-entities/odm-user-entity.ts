import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserRoles } from 'src/user/domain/value-object/enum/user.roles';
import { IOdmUser } from '../../model-entity/odm-model-entity/odm-user-interface';

@Schema({ collection: 'odmuser' })
export class OdmUserEntity extends Document implements IOdmUser{

    @Prop({ type: String, unique: true, required: true }) 
    id: string

    @Prop({ type: String, unique: false, required: true }) 
    name: string;

    @Prop({ type: String, unique: true, required: true }) 
    phone: string;
    
    @Prop({ type: String, unique: true, required: false }) 
    image: string;

    @Prop({ type: String, enum: UserRoles, required: true })    
    type: UserRoles


    @Prop({ 
        type: [
            {
                _id:false,
                id: SchemaTypes.String,
                favorite: SchemaTypes.Boolean,
                lat: SchemaTypes.Number, 
                lng: SchemaTypes.Number, 
                name: SchemaTypes.String
            }
        ], 
        unique: false,
        required: false 
    })   
    direction: { 
        id: string;
        favorite: boolean;
        lat: number; 
        lng: number; 
        name: string; 
    }[];

    @Prop({ 
        type:
            {
                _id:false,
                id:  SchemaTypes.String,
                currency: SchemaTypes.String,
                amount: SchemaTypes.String 
            }
        , 
        unique: false,
        required: false 
    })   
    wallet:{
        id:string,
        currency:string,
        amount:number  
    }

    @Prop({ 
        type: [
            {
                _id:false,
                id:  SchemaTypes.String,
                state: SchemaTypes.String,
            }
        ]
        , 
        unique: false,
        required: false 
    })   
    coupon:{
        id:string,
        state:string,
    }[]
    
}
export const OdmUserSchema = SchemaFactory.createForClass(OdmUserEntity);
