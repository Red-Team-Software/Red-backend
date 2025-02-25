export interface ICreateOrder {
    orderId:           string;
    orderState:        string;
    orderCreateDate:   Date;
    totalAmount:       TotalAmount;
    orderDirection:    OrderDirection;
    orderCourier:      OrderCourier;
    orderUserId:       string;
    products:          Bundle[];
    bundles:           Bundle[];
    orderReceivedDate: null;
    orderReport:       null;
    orderPayment:      OrderPayment;
}

export interface Bundle {
    id:       string;
    quantity: number;
    price:    number;
    currency: string;
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
