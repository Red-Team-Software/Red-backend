export interface CourierRegistredInfraestructureRequestDTO {
    courierId:           string;
    courierName:        string;
    courierImage:       string;
    courierDirection:{
        lat: number;
        long: number;
    }
}