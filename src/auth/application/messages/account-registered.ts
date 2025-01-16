import { Message } from 'src/common/application/events/message/message';
import { ISession } from '../model/session.interface';

export class AccountRegistered extends Message {
    serialize(): string {
        let data= {
            sessions:this.sessions
            ? this.sessions.map(s=>({
                id: s.id,
                expired_at: s.expired_at,
                push_token: s.push_token,
                accountId: s.accountId
            }))
            : [], 
            id: this.id,
            email: this.email,
            password: this.password,
            created_at: this.created_at,
            isConfirmed: this.isConfirmed,
            code: this.code,
            code_created_at: this.code_created_at,
            idUser: this.idUser,
            idStripe: this.idStripe
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