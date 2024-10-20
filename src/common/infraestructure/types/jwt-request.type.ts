export type JwtRequest = {
    user: {
        tokenUser: {
            id: string,
            iat: number,
            exp: number
        }
    }
}