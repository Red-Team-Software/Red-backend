import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { IAccount } from "src/auth/application/model/account.interface";
import { ISession } from "src/auth/application/model/session.interface";

@Schema({ collection: 'odmaccount' })
export class OdmAccount extends Document implements IAccount {

    @Prop({ type: String, unique: true, required: true }) 
    id: string;

    @Prop({ 
        type: [
            {
                _id: false,
                id: SchemaTypes.String,
                expired_at: SchemaTypes.Date,
                push_token: SchemaTypes.String,
                accountId: SchemaTypes.String
            }
        ], 
        unique: false,
        required: true 
    })
    sessions: ISession[];

    @Prop({ type: String, unique: false, required: true }) 
    email: string;

    @Prop({ type: String, unique: false, required: true }) 
    password: string;

    @Prop({ type: Date, unique: false, required: true })
    created_at: Date;

    @Prop({ type: Boolean, unique: false, required: true })
    isConfirmed: boolean;

    @Prop({ type: String, unique: false, required: false })
    code?: string;

    @Prop({ type: Boolean, unique: false, required: false })
    code_created_at?: Date;

    @Prop({ type: String, unique: false, required: true }) 
    idUser: string;

    @Prop({ type: String, unique: false, required: true }) 
    idStripe: string;
}

export const OdmAccountSchema = SchemaFactory.createForClass(OdmAccount);
