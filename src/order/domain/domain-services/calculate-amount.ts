import { Product } from "src/product/domain/aggregate/product.aggregate";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { OrderProduct } from "../entities/order-product/order-product-entity";
import { OrderBundle } from "../entities/order-bundle/order-bundle-entity";
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";


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
                promo.Products.includes(product.getId())
            });

            let productTotal = product.ProductPrice.Price;

            if (promotion) productTotal -= (product.ProductPrice.Price * (promotion.PromotionDiscounts.Value / 100));
            

            productPriceTotals.push({
            productId: product.getId().Value,
            total: productTotal
            });
        });

        bundles.forEach(bundle => {
            let promotion = promotions.find(promo => {
                promo.Bundles.includes(bundle.getId())
            });

            let bundleTotal = bundle.BundlePrice.Price;

            if (promotion) bundleTotal -= (bundle.BundlePrice.Price * (promotion.PromotionDiscounts.Value / 100));
            

            bundlePriceTotals.push({
            bundleId: bundle.getId().Value,
            total: bundleTotal
            });
        });

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