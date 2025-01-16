export interface ICourierRegistered {
    courierId:           string;
    courierName:        string;
    courierImage:       string;
    courierDirection:   ICourierDirection;
    email:              string;
    password:           string;
}

interface ICourierDirection {
    lat: number;
    long: number;
}