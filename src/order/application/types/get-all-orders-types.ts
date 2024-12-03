import { OrderBundle } from "src/order/domain/entities/order-bundle/order-bundle-entity"
import { OrderProduct } from "src/order/domain/entities/order-product/order-product-entity"

export type productsOrderType = {
    products: OrderProduct[]
    orderid: string
}

export type bundlesOrderType = {
    bundles: OrderBundle[]
    orderid: string
}