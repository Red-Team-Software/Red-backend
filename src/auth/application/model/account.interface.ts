import { ISession } from "./session.interface"

export interface IAccount {
    sessions: ISession[] 
    id: string
    email: string
    password: string
    created_at: Date
    isConfirmed:boolean
}
