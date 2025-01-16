import { Message } from 'src/common/application/events/message/message';
import { ISession } from '../model/session.interface';

export class SessionRegistered extends Message {
    serialize(): string {
        let data= {
            id: this.id,
            session:{
                id: this.id,
                expired_at: this.session.expired_at,
                push_token: this.session.push_token,
                accountId:this.session.accountId
            }
        }
        return JSON.stringify(data)
    }
    static create(
        id:string,
        session:ISession
    ){
        return new SessionRegistered(
            id,
            session
        )
    }
    constructor(
        public id: string,
        public session:ISession
    ){
        super()
    }
}