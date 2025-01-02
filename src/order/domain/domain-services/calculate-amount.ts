import { Product } from "src/product/domain/aggregate/product.aggregate";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { BundleDetail } from "../entities/bundle-detail/bundle-detail-entity";
import { ProductDetail } from "../entities/product-detail/product-detail-entity";


type productPriceTotal = {
    productId: string,
    total: number
}

type bundlePriceTotal = {
    bundleId: string,
    total: number
}

export class CalculateAmount {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(
        orderProducts: ProductDetail[],
        orderBundles: BundleDetail[],
        currency: string
    ): OrderTotalAmount {
        let amount = 0;

        //TODO: Agregarle tambien el descuento por categoria si lo tiene 

        orderProducts.forEach(product => {
            amount += product.Price.Price * product.Quantity.Quantity;
        });

        orderBundles.forEach(bundle => {
            amount += bundle.Price.Price * bundle.Quantity.Quantity;
        });

        return OrderTotalAmount.create(amount, currency);
    }

}