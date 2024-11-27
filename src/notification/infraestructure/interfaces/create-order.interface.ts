export interface ICreateOrder {
    orderId:           string;
    orderState:        string;
    orderCreateDate:   Date;
    totalAmount:       TotalAmount;
    orderDirection:    OrderDirection;
    products:          Product[];
    bundles:           Bundle[];
    orderReciviedDate: Date;
    orderPayment:      OrderPayment;
}

export interface ICancelOrder {
    orderId:           string;
    orderState:        string;
}

export interface Bundle {
    id:            OrderBundleIDClass;
    orderBundleId: OrderBundleIDClass;
    quantity:      Quantity;
}

export interface OrderBundleIDClass {
    id: IDID;
}

export interface IDID {
    id: string;
}

export interface Quantity {
    quantity: number;
}

export interface OrderDirection {
    long: number;
    lat:  number;
}

export interface OrderPayment {
    amount:        number;
    currency:      string;
    paymentMethod: string;
}

export interface Product {
    id:             OrderBundleIDClass;
    orderProductId: OrderBundleIDClass;
    quantity:       Quantity;
}

export interface TotalAmount {
    currency: string;
    amount:   number;
}
