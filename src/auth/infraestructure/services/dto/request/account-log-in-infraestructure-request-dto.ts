export interface AccountLogInInfraestructureRequestDTO {
    id:string
    session: {
        id: string;
        expired_at: Date;
        push_token: string;
        accountId: string;
    }
}