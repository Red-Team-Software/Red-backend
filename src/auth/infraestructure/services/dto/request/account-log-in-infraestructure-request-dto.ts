export interface AccountLogInInfraestructureRequestDTO {
    id:string
    sessions: {
        id: string
        expired_at: Date
        push_token: null
        accountId:string
    }
}