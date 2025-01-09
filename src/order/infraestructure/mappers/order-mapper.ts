import { Order } from "src/order/domain/aggregate/order";
import { OrmOrderEntity } from "../entities/orm-order-entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { OrderTotalAmount } from "src/order/domain/value_objects/order-totalAmount";
import { OrderDirection } from "src/order/domain/value_objects/order-direction";
import { OrderCreatedDate } from "src/order/domain/value_objects/order-created-date";
import { OrmOrderPayEntity } from '../entities/orm-order-payment';
import { OrmOrderProductEntity } from "../entities/orm-order-product-entity";
import { OrmOrderBundleEntity } from "../entities/orm-order-bundle-entity";
import { NotFoundException } from "@nestjs/common";
import { ProductID } from '../../../product/domain/value-object/product-id';
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { OrderReceivedDate } from "src/order/domain/value_objects/order-received-date";
import { OrderReport } from "src/order/domain/entities/report/report-entity";
import { OrderReportId } from '../../domain/entities/report/value-object/order-report-id';
import { OrderReportDescription } from '../../domain/entities/report/value-object/order-report-description';
import { OrmOrderReportEntity } from "../entities/orm-order-report-entity";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";
import { PaymentId } from '../../domain/entities/payment/value-object/payment-id';
import { PaymentMethod } from "src/order/domain/entities/payment/value-object/payment-method";
import { PaymentAmount } from "src/order/domain/entities/payment/value-object/payment-amount";
import { PaymentCurrency } from "src/order/domain/entities/payment/value-object/payment-currency";
import { OrderCourier } from "src/order/domain/entities/order-courier/order-courier-entity";
import { OrderCourierId } from "src/order/domain/entities/order-courier/value-object/order-courier-id";
import { OrderCourierDirection } from '../../domain/entities/order-courier/value-object/order-courier-direction';
import { ICourierRepository } from "src/courier/domain/repositories/courier-repository-interface";
import { OrmOrderCourierEntity } from "../entities/orm-order-courier-entity";
import { OrderUserId } from "src/order/domain/value_objects/order-user-id";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrmUserEntity } from "src/user/infraestructure/entities/orm-entities/orm-user-entity";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { OrmWalletEntity } from "src/user/infraestructure/entities/orm-entities/orm-wallet-entity";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { ProductDetail } from "src/order/domain/entities/product-detail/product-detail-entity";
import { BundleDetail } from "src/order/domain/entities/bundle-detail/bundle-detail-entity";
import { ProductDetailId } from "src/order/domain/entities/product-detail/value_object/product-detail-id";
import { ProductDetailQuantity } from "src/order/domain/entities/product-detail/value_object/product-detail-quantity";
import { BundleDetailId } from "src/order/domain/entities/bundle-detail/value_object/bundle-detail-id";
import { BundleDetailQuantity } from "src/order/domain/entities/bundle-detail/value_object/bundle-detail-quantity";
import { ProductDetailPrice } from "src/order/domain/entities/product-detail/value_object/product-detail-price";
import { BundleDetailPrice } from "src/order/domain/entities/bundle-detail/value_object/bundle-detail-price";


export class OrmOrderMapper implements IMapper<Order,OrmOrderEntity> {
    

    constructor(
        private readonly idGen:IIdGen<string>,
        private readonly ormProductRepository: IQueryProductRepository,
        private readonly ormBundleRepository: IQueryBundleRepository,
        private readonly ormCourierRepository: ICourierRepository,
        private readonly ormUserQueryRepository: IQueryUserRepository
    ){
    }
    
    async fromPersistencetoDomain(infraEstructure: OrmOrderEntity): Promise<Order> {

        let products: ProductDetail[] = [];
        let bundles: BundleDetail[] = [];
        let recievedDate: OrderReceivedDate;
        let orderReport: OrderReport;
        let orderPayment: OrderPayment;
        let orderCourier: OrderCourier;

        const ormProducts:OrmOrderProductEntity[] = infraEstructure.order_products;
        const ormBundles:OrmOrderBundleEntity[] = infraEstructure.order_bundles;

        if(ormProducts){
            for (let product of ormProducts){
                let response = await this.ormProductRepository.findProductById(ProductID.create(product.product_id));
                products.push( ProductDetail.create(
                    ProductDetailId.create(response.getValue.getId().Value),
                    ProductDetailQuantity.create(product.quantity),
                    ProductDetailPrice.create(
                        product.price,
                        product.currency
                    )
                ))
            }
        }

        if(ormBundles){
            for (let bundle of ormBundles){
                let response = await this.ormBundleRepository.findBundleById(BundleId.create(bundle.bundle_id));
                bundles.push( BundleDetail.create(
                    BundleDetailId.create(response.getValue.getId().Value),
                    BundleDetailQuantity.create(bundle.quantity),
                    BundleDetailPrice.create(
                        bundle.price,
                        bundle.currency
                    )
                ))
            }
        }

        if(infraEstructure.orderReceivedDate){
            recievedDate = OrderReceivedDate.create(infraEstructure.orderReceivedDate);
        }

        if(infraEstructure.order_report){
            orderReport = OrderReport.create(
                OrderReportId.create(infraEstructure.order_report.id),
                OrderReportDescription.create(infraEstructure.order_report.description));
        }

        if(infraEstructure.pay){
        orderPayment = OrderPayment.create(
            PaymentId.create(infraEstructure.pay.id),
            PaymentMethod.create(infraEstructure.pay.paymentMethod),
            PaymentAmount.create(Number(infraEstructure.pay.amount)),
            PaymentCurrency.create(infraEstructure.pay.currency)
        )}

        if(infraEstructure.order_courier)
        orderCourier = OrderCourier.create(
            OrderCourierId.create(infraEstructure.order_courier.courier_id),
            OrderCourierDirection.create(
                Number(infraEstructure.order_courier.latitude),
                Number(infraEstructure.order_courier.longitude)
            )
        );

        let order = Order.initializeAggregate(
            OrderId. create(infraEstructure.id),
            OrderState.create(infraEstructure.state),
            OrderCreatedDate.create(infraEstructure.orderCreatedDate),
            OrderTotalAmount.create(Number(infraEstructure.totalAmount),infraEstructure.currency),
            OrderDirection.create(infraEstructure.latitude,infraEstructure.longitude),
            orderCourier,
            OrderUserId.create(infraEstructure.user.id),
            products,
            bundles,
            recievedDate,
            orderReport,
            orderPayment
        );

        return order;
    }
    
    async fromDomaintoPersistence(domainEntity: Order): Promise<OrmOrderEntity> {

        let ormOrderPayEntity: OrmOrderPayEntity;
        if(domainEntity.OrderPayment){
            ormOrderPayEntity = OrmOrderPayEntity.create(
                domainEntity.OrderPayment.OrderPaymentId.Value,
                domainEntity.OrderPayment.PaymentAmount.Value,
                domainEntity.OrderPayment.PaymentCurrency.Value,
                domainEntity.OrderPayment.PaymentMethods.Value,
                domainEntity.getId().orderId
            );
        }  
        
        let ormProducts: OrmOrderProductEntity[] = [];

        for (let product of domainEntity.Products){
            let response = await this.ormProductRepository.findProductById(ProductID.create(product.ProductDetailId.productDetailId));
            if(!response.isSuccess())
                throw new NotFoundException('Find product id not registered')

            ormProducts.push(
                OrmOrderProductEntity.create(
                    domainEntity.getId().orderId,
                    response.getValue.getId().Value,
                    product.Quantity.Quantity,
                    product.Price.Price,
                    product.Price.Currency
                )
            )
        }

        let ormBundles: OrmOrderBundleEntity[] = [];

        for (let bundle of domainEntity.Bundles){
            let response = await this.ormBundleRepository.findBundleById(BundleId.create(bundle.getId().BundleDetailId));
            
            if(!response.isSuccess())
                throw new NotFoundException('Find bundle id not registered')

            ormBundles.push(
                OrmOrderBundleEntity.create(
                    domainEntity.getId().orderId,
                    response.getValue.getId().Value,
                    bundle.Quantity.Quantity,
                    bundle.Price.Price,
                    bundle.Price.Currency
                )
            )
        }

        let orderOrmReport: OrmOrderReportEntity;
        if(domainEntity.OrderReport){
            orderOrmReport = OrmOrderReportEntity.create(
                domainEntity.OrderReport.getId().OrderReportId,
                domainEntity.OrderReport.Description.Value,
                domainEntity.getId().orderId
            )
        }

        let orderCourier = OrmOrderCourierEntity.create(
            domainEntity.getId().orderId,
            domainEntity.OrderCourier.getId().OrderCourierId,
            domainEntity.OrderCourier.CourierDirection.Latitude,
            domainEntity.OrderCourier.CourierDirection.Longitude
        )

        let orderReceivedDate = domainEntity.OrderReceivedDate ? domainEntity.OrderReceivedDate.OrderReceivedDate : null;

        let userDomain = await this.ormUserQueryRepository.findUserById(UserId.create(domainEntity.OrderUserId.userId));

        let ormUser = OrmUserEntity.create(
            userDomain.getValue.getId().Value,
            userDomain.getValue.UserName.Value,
            userDomain.getValue.UserPhone.Value,
            userDomain.getValue.UserRole.Value as UserRoles,
            OrmWalletEntity.create(
                userDomain.getValue.Wallet.getId().Value,
                userDomain.getValue.Wallet.Ballance.Currency,
                userDomain.getValue.Wallet.Ballance.Amount,   
            ),
            userDomain.getValue.UserImage ? userDomain.getValue.UserImage.Value : null 
        )

        let orrOrder = OrmOrderEntity.create(
            domainEntity.getId().orderId,
            domainEntity.OrderState.orderState,
            domainEntity.OrderCreatedDate.OrderCreatedDate,
            domainEntity.TotalAmount.OrderAmount,
            domainEntity.TotalAmount.OrderCurrency,
            domainEntity.OrderDirection.Latitude,
            domainEntity.OrderDirection.Longitude,
            orderCourier,
            ormUser,
            ormOrderPayEntity,
            ormProducts,
            ormBundles,
            orderReceivedDate,
            domainEntity.OrderReport ? orderOrmReport : null,
        );

        return orrOrder;
    }
}