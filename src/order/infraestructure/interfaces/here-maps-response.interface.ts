export interface IhereMapsResponse {
    routes: Route[];
}

export interface Route {
    id:       string;
    sections: Section[];
}

export interface Section {
    id:        string;
    type:      string;
    departure: Arrival;
    arrival:   Arrival;
    summary:   Summary;
    transport: Transport;
}

export interface Arrival {
    time:  Date;
    place: Place;
}

export interface Place {
    type:             string;
    location:         Location;
    originalLocation: Location;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Summary {
    duration:     number;
    length:       number;
    baseDuration: number;
}

export interface Transport {
    mode: string;
}
