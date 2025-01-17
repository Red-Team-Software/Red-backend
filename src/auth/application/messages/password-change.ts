import { Message } from 'src/common/application/events/message/message';
import { ISession } from '../model/session.interface';

export class AccountRegistered extends Message {
    serialize(): string {
        let data= {
            id: this.id,
            password: this.password
        }
        return JSON.stringify(data)
    }
    static create(
        sessions: ISession[], 
        id: string,
        email: string,
        password: string,
        created_at: Date,
        isConfirmed:boolean,
        code: null,
        code_created_at:null,
        idUser:string,
        idStripe:string
    ){
        return new AccountRegistered(
            sessions, 
            id,
            email,
            password,
            created_at,
            isConfirmed,
            code,
            code_created_at,
            idUser,
            idStripe
        )
    }
    constructor(
        public sessions: ISession[], 
        public id: string,
        public email: string,
        public password: string,
        public created_at: Date,
        public isConfirmed:boolean,
        public code: null,
        public code_created_at:null,
        public idUser:string,
        public idStripe:string
    ){
        super()
    }
}