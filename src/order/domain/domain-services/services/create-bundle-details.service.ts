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
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { ProductDetailQuantity } from "../../entities/product-detail/value_object/product-detail-quantity";
import { ProductDetailPrice } from "../../entities/product-detail/value_object/product-detail-price";
import { BundleDetailQuantity } from "../../entities/bundle-detail/value_object/bundle-detail-quantity";
import { BundleDetailPrice } from "../../entities/bundle-detail/value_object/bundle-detail-price";

type bundleDetails = {
    id: string,
    quantity: number
}


export class CreateBundleDetailService {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(
        bundles: Bundle[], 
        promotions: Promotion[],
        bundlesEntry: bundleDetails[],
    ): BundleDetail[] {
        let b: BundleDetail[] = [];

        bundles.forEach(bundle => {
            let promotion = promotions.find(promo => {
                return promo.Bundles.some(bundleId => bundleId.Value === bundle.getId().Value);
            });
                
            let bundleTotal = bundle.BundlePrice.Price;
                
            if (promotion) 
                bundleTotal -= (bundle.BundlePrice.Price * (promotion.PromotionDiscounts.Value ));
                
            let bu = BundleDetail.create(
                BundleDetailId.create(bundle.getId().Value),
                BundleDetailQuantity.create(bundlesEntry.find(b=>b.id==bundle.getId().Value).quantity),
                BundleDetailPrice.create(bundleTotal, bundle.BundlePrice.Currency)
            );
        
            b.push( bu );
        });

        

        return b;
    }

}

export class CalculateAmountService {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(
        products: Product[], 
        bundles: Bundle[],
        orderProducts: ProductDetail[],
        orderBundles: BundleDetail[],
        cupon: Cupon,
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

        if (cupon) amount -= (amount * ( cupon.CuponDiscount.Value ));

        return OrderTotalAmount.create(amount, currency);
    }

}