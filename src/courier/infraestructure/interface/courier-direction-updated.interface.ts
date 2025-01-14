export interface ICourierDirectionUpdated {
    courierId:           string;
    courierDirection:   ICourierDirection;
}

interface ICourierDirection {
    lat: number;
    long: number;
}