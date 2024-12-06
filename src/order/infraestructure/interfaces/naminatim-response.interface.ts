export interface NaminatimResponse {
    place_id:     number;
    licence:      string;
    osm_type:     string;
    osm_id:       number;
    lat:          string;
    lon:          string;
    category:     string;
    type:         string;
    place_rank:   number;
    importance:   number;
    addresstype:  string;
    name:         string;
    display_name: string;
    address:      Address;
    boundingbox:  string[];
}

export interface Address {
    city:             string;
    municipality:     string;
    state_district:   string;
    region:           string;
    "ISO3166-2-lvl4": string;
    country:          string;
    country_code:     string;
}
