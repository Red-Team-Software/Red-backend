import { Message } from 'src/common/application/events/message/message';

export class SessionRegistered extends Message {
    serialize(): string {
        let data= {
            id: this.id,
            expired_at: this.expired_at,
            push_token: this.push_token,
            accountId:this.accountId
        }
        return JSON.stringify(data)
    }
    static create(
        id: string,
        expired_at: Date,
        push_token: string,
        accountId:string
    ){
        return new SessionRegistered(
            id,
            expired_at,
            push_token,
            accountId
        )
    }
    constructor(
        public id: string,
        public expired_at: Date,
        public push_token: string,
        public accountId:string
    ){
        super()
    }
}