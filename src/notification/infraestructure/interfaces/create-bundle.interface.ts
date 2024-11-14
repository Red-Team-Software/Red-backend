export interface ICreateBundle {
    bundleId:           string;
    bundleDescription:  string;
    bundleCaducityDate: Date;
    bundleName:         string;
    bundleStock:        number;
    bundleImages:       string[];
    bundlePrice:        BundlePrice;
    bundleWeigth:       BundleWeigth;
    bundleProductId:    string[];
}

export interface BundlePrice {
    currency: string;
    price:    number;
}

export interface BundleWeigth {
    weigth:  number;
    measure: string;
}
