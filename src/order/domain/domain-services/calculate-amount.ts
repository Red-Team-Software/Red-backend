import { Product } from "src/product/domain/aggregate/product.aggregate";
import { OrderTotalAmount } from "../value_objects/order-totalAmount";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { OrderProduct } from "../entities/order-product/order-product-entity";
import { OrderBundle } from "../entities/order-bundle/order-bundle-entity";
import { ProductID } from "src/product/domain/value-object/product-id";


export class CalculateAmount {

    //TODO: Refactor when coupon and discount are implemented

    calculateAmount(products: Product[], bundles: Bundle[],orderProducts: OrderProduct[],orderBundles: OrderBundle[] = [], currency: string): OrderTotalAmount {
        let amount = 0;

        products.forEach(product => {
            let orderProduct = orderProducts.find(op => op.OrderProductId.OrderProductId === product.getId().Value);
            amount += product.ProductPrice.Price * orderProduct.Quantity.Quantity;
        });

        bundles.forEach(bundle => {
            let orderBundle = orderBundles.find(ob => ob.OrderBundleId.OrderBundleId === bundle.getId().Value);
            amount += bundle.BundlePrice.Price * orderBundle.Quantity.OrderBundleQuantity;
        });

        return OrderTotalAmount.create(amount, currency);
    }

}