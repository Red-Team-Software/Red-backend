export interface OrderUpdatedInfraestructureRequestDTO {
    orderId:           string;
    orderState?:        string;
    orderCreateDate?:   Date;
    totalAmount?:       TotalAmount;
    orderDirection?:    OrderDirection;
    orderCourierId?:      string;
    orderUserId?:       string;
    products?:          Details[];
    bundles?:           Details[];
    orderReceivedDate?: Date;
    orderReport?:       Report;
    orderPayment?:      OrderPayment;
    orderCupon?:        string;
}

interface Details {
    id:       string;
    quantity: number;
    price:    number;
    currency: string;
}

interface OrderDirection {
    lat:  number;
    long: number;
}

interface OrderPayment {
    paymentId:  string;
    paymentMethod:   string;
    paymentAmount:   number;
    paymentCurrency: string;
}

interface TotalAmount {
    amount:   number;
    currency: string;
}

interface Report {
    id:   string;
    description: string;
}