export interface ProductRegistredInfraestructureRequestDTO {
    productId:           string;
    productDescription:  string;
    productCaducityDate?: Date;
    productName:         string;
    productStock:        number;
    productImage:        string[];
    productPrice:{ 
        currency: string;
        price:    number;
    }
    productWeigth:{
        weigth:  number;
        measure: string;
    }
}