export interface IAccountRegistered  {
    sessions: {
        id: string
        expired_at: Date
        push_token: null
        accountId:string
    } []
    id: string
    email: string
    password: string
    created_at: Date
    isConfirmed:boolean,
    code: null
    code_created_at:null
    idUser:string
    idStripe:string
}