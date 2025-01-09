import { Product } from "src/product/domain/aggregate/product.aggregate";
import { OrderTotalAmount } from "../../value_objects/order-totalAmount";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate"
import { InsufficientBundleStockException } from "../../exception/insufficient-bundle-stock-exception";
import { InsufficientProductStockException } from "../../exception/insufficient-product-stock-exception";
import { ProductDetail } from "../../entities/product-detail/product-detail-entity";
import { BundleDetail } from "../../entities/bundle-detail/bundle-detail-entity";
import { ProductDetailId } from "../../entities/product-detail/value_object/product-detail-id";
import { BundleDetailId } from "../../entities/bundle-detail/value_object/bundle-detail-id";

export class CalculateAmountService {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(
        products: Product[], 
        bundles: Bundle[],
        orderProducts: ProductDetail[],
        orderBundles: BundleDetail[],
        currency: string
    ): OrderTotalAmount {
        let amount = 0;

        products.forEach(product => {

            const orderProduct= orderProducts.find(
                ob => ob.ProductDetailId.equals( ProductDetailId.create(product.getId().Value))
            )

            if (orderProduct.Quantity.Quantity > product.ProductStock.Value) 
                throw new InsufficientProductStockException(
                    product.getId().Value,
                    product.ProductName.Value,
                    orderProduct.Quantity.Quantity,
                    product.ProductStock.Value
                )

        });

        bundles.forEach(bundle => {

            const orderBundle= orderBundles.find(
                ob => ob.BundleDetailId.equals( BundleDetailId.create(bundle.getId().Value))
            )

            if (orderBundle.Quantity.Quantity > bundle.BundleStock.Value) 
                throw new InsufficientBundleStockException(
                    bundle.getId().Value,
                    bundle.BundleName.Value,
                    orderBundle.Quantity.Quantity,
                    bundle.BundleStock.Value
                )
        })


        orderProducts.forEach(orderProduct => {
            amount += orderProduct.Price.Price * orderProduct.Quantity.Quantity;
        });

        orderBundles.forEach(orderBundle => {
            amount += orderBundle.Price.Price * orderBundle.Quantity.Quantity;
        });

        return OrderTotalAmount.create(amount, currency);
    }

}