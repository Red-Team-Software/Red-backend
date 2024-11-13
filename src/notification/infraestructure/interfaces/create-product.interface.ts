export interface ICreateProduct {
    productId:           string;
    productDescription:  string;
    productCaducityDate: Date;
    productName:         string;
    productStock:        number;
    productImage:        string[];
    productPrice:        ProductPrice;
    productWeigth:       ProductWeigth;
}

export interface ProductPrice {
    currency: string;
    price:    number;
}

export interface ProductWeigth {
    weigth:  number;
    measure: string;
}
