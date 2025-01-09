export interface ProductUpdatedInfraestructureRequestDTO {
    productId:           string;
    productDescription?:  string;
    productCaducityDate?: Date;
    productName?:         string;
    productStock?:        number;
    productImages?:        string[];
    productPrice?:{ 
        currency: string;
        price:    number;
    }
    productWeigth?:{
        weigth:  number;
        measure: string;
    }
}