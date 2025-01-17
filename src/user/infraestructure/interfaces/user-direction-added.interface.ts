export interface IUserDirectionAdded  {
    userId: string
    userDirection: {
        id: string;
        name: string;
        favorite: boolean;
        lat: number;
        lng: number;
    }
}