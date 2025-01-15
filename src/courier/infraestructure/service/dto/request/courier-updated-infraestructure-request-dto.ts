export interface CourierUpdatedInfraestructureRequestDTO {
    courierId:           string;
    courierDirection:{
        lat: number;
        long: number
    }
}