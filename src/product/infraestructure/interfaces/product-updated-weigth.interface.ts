export interface IProductUpdatedWeigth {
  productId:           string;
  productWeigth:       ProductWeigth;
}

export interface ProductWeigth {
  weigth:  number;
  measure: string;
}