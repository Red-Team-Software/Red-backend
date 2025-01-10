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

type productDetails = {
    id: string,
    quantity: number
}


export class CreateProductDetailService {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(
        products: Product[], 
        promotions: Promotion[],
        productsEntry: productDetails[],
    ): ProductDetail[] {
        let p: ProductDetail[] = [];

        products.forEach(product => {
            let promotion = promotions.find(promo => {
                return promo.Products.some(productId => productId.Value === product.getId().Value);
            });
                
            let productTotal = product.ProductPrice.Price;
                
            if (promotion) productTotal -= (product.ProductPrice.Price * (promotion.PromotionDiscounts.Value));
                
            let pr = ProductDetail.create(
                ProductDetailId.create(product.getId().Value),
                ProductDetailQuantity.create(productsEntry.find(p=>p.id==product.getId().Value).quantity),
                ProductDetailPrice.create(productTotal, product.ProductPrice.Currency)
            );
        
            p.push( pr );
        
        });

        

        return p;
    }

}