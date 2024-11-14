import { Order } from "src/Order/domain/aggregate/order";
import { OrmOrderEntity } from "../entities/orm-order-entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { OrderId } from "src/Order/domain/value_objects/orderId";
import { OrderState } from "src/Order/domain/value_objects/orderState";
import { OrderTotalAmount } from "src/Order/domain/value_objects/order-totalAmount";
import { OrderDirection } from "src/Order/domain/value_objects/order-direction";
import { OrderCreatedDate } from "src/Order/domain/value_objects/order-created-date";
import { OrmOrderPayEntity } from '../entities/orm-order-payment';
import { OrderPayment } from "src/Order/domain/value_objects/order-payment";
import { IProductRepository } from "src/product/domain/repository/product.interface.repositry";
import { OrmOrderProductEntity } from "../entities/orm-order-product-entity";
import { OrmOrderBundleEntity } from "../entities/orm-order-bundle-entity";
import { IBundleRepository } from "src/bundle/domain/repository/product.interface.repositry";
import { NotFoundException } from "@nestjs/common";


export class OrmOrderMapper implements IMapper<Order,OrmOrderEntity> {
    
    constructor(
        private readonly idGen:IIdGen<string>,
        private readonly ormProductRepository: IProductRepository,
        private readonly ormBundleRepository: IBundleRepository
    ){}
    
    async fromPersistencetoDomain(infraEstructure: OrmOrderEntity): Promise<Order> {

        // const ormProducts = await this.ormOrderProductRepository.findProductsByOrderId(domainEntity.getId());

        // const products: Product[] = [];

        // products.forEach( (product) => {
            
        // });



        let order = Order.initializeAggregate(
            OrderId. create(infraEstructure.id),
            OrderState.create(infraEstructure.state),
            OrderCreatedDate.create(infraEstructure.orderCreatedDate),
            OrderTotalAmount.create(infraEstructure.totalAmount,infraEstructure.currency),
            OrderDirection.create(infraEstructure.latitude,infraEstructure.longitude),
            null,
            null,
            null,
            null,
            OrderPayment.create(infraEstructure.pay.amount,infraEstructure.pay.currency,infraEstructure.pay.paymentMethod)
        );

        return order;
    }
    
    async fromDomaintoPersistence(domainEntity: Order): Promise<OrmOrderEntity> {

        let ormOrderPayEntity: OrmOrderPayEntity;
        if(domainEntity.OrderPayment){
            ormOrderPayEntity = OrmOrderPayEntity.create(
                await this.idGen.genId(),
                domainEntity.OrderPayment.Amount,
                domainEntity.OrderPayment.Currency,
                domainEntity.OrderPayment.PaymentMethod,
                domainEntity.getId().orderId
            );
        }  
        
        let ormProducts: OrmOrderProductEntity[] = [];

        for (let product of domainEntity.Products){
            let response = await this.ormProductRepository.findProductById(product.getId().OrderProductId);
            if(!response.isSuccess())
                throw new NotFoundException('Find product id not registered')

            ormProducts.push(
                OrmOrderProductEntity.create(
                    domainEntity.getId().orderId,
                    response.getValue.getId().Value,
                    domainEntity.Products[0].Quantity.Quantity
                )
            )
        }

        let ormBundles: OrmOrderBundleEntity[] = [];

        for (let bundle of domainEntity.Bundles){
            let response = await this.ormBundleRepository.findBundleById(bundle.getId().OrderBundleId);
            
            if(!response.isSuccess())
                throw new NotFoundException('Find bundle id not registered')

            ormBundles.push(
                OrmOrderBundleEntity.create(
                    domainEntity.getId().orderId,
                    response.getValue.getId().Value,
                    domainEntity.Bundles[0].Quantity.OrderBundleQuantity
                )
            )
        }

        return OrmOrderEntity.create(
            domainEntity.getId().orderId,
            domainEntity.OrderState.orderState,
            domainEntity.OrderCreatedDate.OrderCreatedDate,
            domainEntity.TotalAmount.OrderAmount,
            domainEntity.TotalAmount.OrderCurrency,
            domainEntity.OrderDirection.Latitude,
            domainEntity.OrderDirection.Longitude,
            ormOrderPayEntity,
            ormProducts,
            ormBundles,
            domainEntity.OrderReciviedDate.OrderReciviedDate,
        );
    }
}