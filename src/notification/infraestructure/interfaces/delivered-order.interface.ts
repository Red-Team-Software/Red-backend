import { OrderCreatedDate } from '../../../order/domain/value_objects/order-created-date';
export interface IDeliveredOrder {
    orderId:           string;
    orderState:        string;
    orderUserId:       string;
    OrderCreatedDate:  Date;
};