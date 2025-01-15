export interface ICourierModel{
    courierId: string,
    courierName: string,
    courierImage: string,
    courierDirection: {
        lat: number,
        long: number
    }
    email: string,
    password: string
}