export interface ICourierRegistered {
    courierId:           string;
    courierName:        string;
    courierImage:       string;
    courierDirection:   ICourierDirection;
}

interface ICourierDirection {
    lat: number;
    long: number;
}