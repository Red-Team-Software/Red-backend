import { OrderCurrencyEnum } from "src/order/domain/value_objects/enum/order-enum-currency-total-amoun";

export const reverseCurrencyMap: { [key in OrderCurrencyEnum]: string } = {
    [OrderCurrencyEnum.usd]: "USD",
    [OrderCurrencyEnum.bsf]: "VES",
    [OrderCurrencyEnum.eur]: "EUR"
};