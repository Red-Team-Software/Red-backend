export interface AccountLogInInfraestructureRequestDTO {
    sessions: {
        id: string
        expired_at: Date
        push_token: null
        accountId:string
    }
}