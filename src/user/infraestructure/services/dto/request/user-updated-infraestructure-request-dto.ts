export interface UserUpdatedInfraestructureRequestDTO {
    userId: string;
    userName?: string;
    userPhone?: string;
    wallet?: {
        walletId: string;
        ballance: {
            currency: string;
            amount: number;
        };
    };
    coupons?: {
        id: string;
        state: string;
    }[];
    userImage?: string;

    userDirection?: {
        id: string;
        name: string;
        favorite: boolean;
        lat: number;
        lng: number;
    }
}