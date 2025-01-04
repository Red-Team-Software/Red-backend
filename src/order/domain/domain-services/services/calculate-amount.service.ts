import { Product } from "src/product/domain/aggregate/product.aggregate";
import { OrderTotalAmount } from "../../value_objects/order-totalAmount";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { OrderProduct } from "../../entities/order-product/order-product-entity";
import { OrderBundle } from "../../entities/order-bundle/order-bundle-entity";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
import { OrderProductId } from "../../entities/order-product/value_object/order-productId";
import { OrderBundleId } from "../../entities/order-bundle/value_object/order-bundlesId";
import { InsufficientBundleStockException } from "../../exception/insufficient-bundle-stock-exception";
import { InsufficientProductStockException } from "../../exception/insufficient-product-stock-exception";


type productPriceTotal = {
    productId: string,
    total: number
}

type bundlePriceTotal = {
    bundleId: string,
    total: number
}

export class CalculateAmountService {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(
        products: Product[], 
        bundles: Bundle[],
        orderProducts: OrderProduct[],
        orderBundles: OrderBundle[],
        promotions: Promotion[],
        currency: string
    ): OrderTotalAmount {
        let amount = 0;

        let productPriceTotals: productPriceTotal[] = [];
        let bundlePriceTotals: bundlePriceTotal[] = [];

        products.forEach(product => {
            let promotion = promotions.find(promo => {
                return promo.Products.some(productId => productId.Value === product.getId().Value);
            });

            let productTotal = product.ProductPrice.Price;

            if (promotion) 
                productTotal -= (product.ProductPrice.Price * (promotion.PromotionDiscounts.Value));

            const orderProduct= orderProducts.find(
                ob => ob.OrderProductId.equals( OrderProductId.create(product.getId().Value))
            )

            if (orderProduct.Quantity.Quantity > product.ProductStock.Value) 
                throw new InsufficientProductStockException(
                    product.getId().Value,
                    product.ProductName.Value,
                    orderProduct.Quantity.Quantity,
                    product.ProductStock.Value
                )

            productPriceTotals.push({
            productId: product.getId().Value,
            total: productTotal
            });
        });

        bundles.forEach(bundle => {
            let promotion = promotions.find(promo => {
                return promo.Bundles.some(bundleId => bundleId.Value === bundle.getId().Value);
            });

            let bundleTotal = bundle.BundlePrice.Price;

            if (promotion) bundleTotal -= (bundle.BundlePrice.Price * (promotion.PromotionDiscounts.Value ));

            const orderBundle= orderBundles.find(
                ob => ob.OrderBundleId.equals( OrderBundleId.create(bundle.getId().Value))
            )

            if (orderBundle.Quantity.OrderBundleQuantity > bundle.BundleStock.Value) 
                throw new InsufficientBundleStockException(
                    bundle.getId().Value,
                    bundle.BundleName.Value,
                    orderBundle.Quantity.OrderBundleQuantity,
                    bundle.BundleStock.Value
                )

            bundlePriceTotals.push({
            bundleId: bundle.getId().Value,
            total: bundleTotal
            })
        })

        //TODO: Agregarle tambien el descuento por categoria si lo tiene 

        // productPriceTotals.forEach(product => {


        // });

        productPriceTotals.forEach(product => {
            let orderProduct = orderProducts.find(op => op.OrderProductId.OrderProductId === product.productId);
            amount += product.total * orderProduct.Quantity.Quantity;
        });

        bundlePriceTotals.forEach(bundle => {
            let orderBundle = orderBundles.find(ob => ob.OrderBundleId.OrderBundleId === bundle.bundleId);
            amount += bundle.total * orderBundle.Quantity.OrderBundleQuantity;
        });

        return OrderTotalAmount.create(amount, currency);
    }

}