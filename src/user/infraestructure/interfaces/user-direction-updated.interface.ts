export interface IUserDirectionUpdated  {
    userId: string
    userDirection: {
        id: string;
        name: string;
        favorite: boolean;
        lat: number;
        lng: number;
    }
}