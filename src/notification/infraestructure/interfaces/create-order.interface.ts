export interface ICreateOrder {
    orderId:           string;
    orderState:        string;
    orderCreateDate:   Date;
    totalAmount:       TotalAmount;
    orderDirection:    OrderDirection;
    orderCourier:      string;
    orderUserId:       string;
    products:          Details[];
    bundles:           Details[];
    orderReceivedDate: null;
    orderReport:       null;
    orderPayment:      OrderPayment;
    orderCupon:        string;
}

export interface Details {
    id:       string;
    quantity: number;
    price:    number;
}
export interface OrderDirection {
    lat:  number;
    long: number;
}

export interface OrderPayment {
    paymentId:  string;
    paymentMethod:   string;
    paymentAmount:   number;
    paymentCurrency: string;
}

export interface TotalAmount {
    amount:   number;
    currency: string;
}
