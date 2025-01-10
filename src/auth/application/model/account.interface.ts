import { ISession } from "./session.interface"

export interface IAccount {
    sessions?: ISession[] 
    id: string
    email: string
    password: string
    created_at: Date
    isConfirmed:boolean,
    code?: string
    code_created_at?:Date
    idUser:string
    idStripe:string
}
