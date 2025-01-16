import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Order } from "src/order/domain/aggregate/order";
import { OdmOrder } from "../../entities/odm-entities/odm-order-entity";
import { Model } from "mongoose";
import { OdmProduct } from "src/product/infraestructure/entities/odm-entities/odm-product-entity";
import { OdmBundle } from "src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity";
import { OdmCourier } from "src/courier/infraestructure/entities/odm-entities/odm-courier-entity";
import { ProductDetail } from "src/order/domain/entities/product-detail/product-detail-entity";
import { BundleDetail } from "src/order/domain/entities/bundle-detail/bundle-detail-entity";
import { OrderReceivedDate } from "src/order/domain/value_objects/order-received-date";
import { OrderReport } from "src/order/domain/entities/report/report-entity";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";
import { OrmOrderProductEntity } from "../../entities/orm-entities/orm-order-product-entity";
import { OrmOrderBundleEntity } from "../../entities/orm-entities/orm-order-bundle-entity";
import { ProductDetailId } from "src/order/domain/entities/product-detail/value_object/product-detail-id";
import { ProductDetailQuantity } from "src/order/domain/entities/product-detail/value_object/product-detail-quantity";
import { ProductDetailPrice } from "src/order/domain/entities/product-detail/value_object/product-detail-price";
import { BundleDetailId } from "src/order/domain/entities/bundle-detail/value_object/bundle-detail-id";
import { BundleDetailQuantity } from "src/order/domain/entities/bundle-detail/value_object/bundle-detail-quantity";
import { BundleDetailPrice } from "src/order/domain/entities/bundle-detail/value_object/bundle-detail-price";
import { OrderReportId } from "src/order/domain/entities/report/value-object/order-report-id";
import { OrderReportDescription } from "src/order/domain/entities/report/value-object/order-report-description";
import { PaymentId } from "src/order/domain/entities/payment/value-object/payment-id";
import { PaymentMethod } from "src/order/domain/entities/payment/value-object/payment-method";
import { PaymentAmount } from "src/order/domain/entities/payment/value-object/payment-amount";
import { PaymentCurrency } from "src/order/domain/entities/payment/value-object/payment-currency";
import { OrderCuponId } from "src/order/domain/value_objects/order-cupon-id";
import { OrderCourierId } from "src/order/domain/value_objects/order-courier-id";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { OrderCreatedDate } from "src/order/domain/value_objects/order-created-date";
import { OrderTotalAmount } from "src/order/domain/value_objects/order-totalAmount";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { OrderUserId } from "src/order/domain/value_objects/order-user-id";


export class OdmOrderMapper implements IMapper<Order,OdmOrder> {

    constructor(
    ){
    }
    
    async fromPersistencetoDomain(infraEstructure: OdmOrder): Promise<Order> {

        let products: ProductDetail[] = [];
        let bundles: BundleDetail[] = [];
        
        if(infraEstructure.product_details){
            for (let product of infraEstructure.product_details){
                products.push( 
                    ProductDetail.create(
                        ProductDetailId.create(product.id),
                        ProductDetailQuantity.create(product.quantity),
                        ProductDetailPrice.create(
                            product.price,
                            product.currency
                        )
                    )
                )
            }
        }
        
        if(infraEstructure.bundle_details){
            for (let bundle of infraEstructure.bundle_details){
                bundles.push( 
                    BundleDetail.create(
                        BundleDetailId.create(bundle.id),
                        BundleDetailQuantity.create(bundle.quantity),
                        BundleDetailPrice.create(
                            bundle.price,
                            bundle.currency
                        )
                    )
                )
            }
        }
        
        
        let order = Order.initializeAggregate(
            OrderId. create(infraEstructure.id),
            OrderState.create(infraEstructure.state),
            OrderCreatedDate.create(infraEstructure.createdDate),
            OrderTotalAmount.create(Number(infraEstructure.totalAmount),infraEstructure.currency),
            OrderDirection.create(infraEstructure.latitude,infraEstructure.longitude),
            OrderUserId.create(infraEstructure.user_id),
            infraEstructure.coupon_id 
                ? OrderCuponId.create(infraEstructure.coupon_id) 
                : null,
            infraEstructure.courier_id 
                ? OrderCourierId.create(infraEstructure.courier_id) 
                : null,
            products,
            bundles,
            infraEstructure.receivedDate
                ? OrderReceivedDate.create(infraEstructure.receivedDate)
                : null,
            infraEstructure.report 
                ? OrderReport.create(
                    OrderReportId.create(infraEstructure.report.id),
                    OrderReportDescription.create(infraEstructure.report.description))
                : null,
            OrderPayment.create(
                PaymentId.create(infraEstructure.order_payment.id),
                PaymentMethod.create(infraEstructure.order_payment.paymentMethod),
                PaymentAmount.create(Number(infraEstructure.order_payment.amount)),
                PaymentCurrency.create(infraEstructure.order_payment.currency)
            )
        );
        
    return order;

    }
    
    async fromDomaintoPersistence(domainEntity: Order): Promise<OdmOrder> {

        throw new Error("Method not implemented.");
    }
}