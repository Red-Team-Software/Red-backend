export interface IProductUpdatedPrice {
  productId:           string;
  productPrice:        ProductPrice;
}

export interface ProductPrice {
  currency: string;
  price:    number;
}