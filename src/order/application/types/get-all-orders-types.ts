import { BundleDetail } from "src/order/domain/entities/bundle-detail/bundle-detail-entity"
import { ProductDetail } from "src/order/domain/entities/product-detail/product-detail-entity"


export type productsOrderType = {
    products: ProductDetail[]
    orderid: string
}

export type bundlesOrderType = {
    bundles: BundleDetail[]
    orderid: string
}