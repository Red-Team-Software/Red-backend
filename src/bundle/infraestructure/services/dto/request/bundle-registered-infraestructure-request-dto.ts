export interface BundleRegistredInfraestructureRequestDTO {
    bundleId:           string;
    bundleDescription:  string;
    bundleCaducityDate?: Date;
    bundleName:         string;
    bundleStock:        number;
    bundleImages:       string[];
    bundlePrice:{
        currency: string;
        price:    number;
    }
    bundleWeigth:{
        weigth:  number;
        measure: string;
    }
    bundleProductId:    string[];
}