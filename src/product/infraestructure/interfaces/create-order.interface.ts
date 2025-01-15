
export interface ICreateOrder {
    orderId:           string;
    orderState:        string;
    orderCreateDate:   Date;
    totalAmount:       TotalAmount;
    orderDirection:    OrderDirection;
    orderCourierId:    string;
    orderCupon:      string;
    orderUserId:       string;
    products:          Details[];
    bundles:           Details[];
    orderReceivedDate: null;
    orderReport:       null;
    orderPayment:      OrderPayment;
}

export interface Details {
    id:       string;
    quantity: number;
    price:    number;
}

export interface OrderCourier {
    id: string;
}

export interface OrderDirection {
    long: number;
    lat:  number;
}

export interface OrderPayment {
    id:              OrderCourier;
    orderPaymentId:  OrderCourier;
    paymentMethod:   PaymentMethod;
    paymentAmount:   PaymentAmount;
    paymentCurrency: PaymentCurrency;
}

export interface PaymentAmount {
    amount: number;
}

export interface PaymentCurrency {
    currency: string;
}

export interface PaymentMethod {
    method: string;
}

export interface TotalAmount {
    currency: string;
    amount:   number;
}
