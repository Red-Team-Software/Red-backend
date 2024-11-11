import { Order } from "src/Order/domain/aggregate/order";
import { OrmOrderEntity } from "../entities/orm-order-entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { OrderId } from "src/Order/domain/value_objects/orderId";
import { OrderState } from "src/Order/domain/value_objects/orderState";
import { OrderTotalAmount } from "src/Order/domain/value_objects/order-totalAmount";
import { OrderDirection } from "src/Order/domain/value_objects/order-direction";
import { OrderCreatedDate } from "src/Order/domain/value_objects/order-created-date";


export class OrmOrderMapper implements IMapper<Order,OrmOrderEntity> {
    
    constructor(
        private readonly idGen:IIdGen<string>
    ){}
    
    async fromPersistencetoDomain(infraEstructure: OrmOrderEntity): Promise<Order> {
        let order = Order.initializeAggregate(
            OrderId. create(infraEstructure.id),
            OrderState.create(infraEstructure.state),
            OrderCreatedDate.create(infraEstructure.orderCreatedDate),
            OrderTotalAmount.create(infraEstructure.totalAmount,infraEstructure.currency),
            OrderDirection.create(infraEstructure.latitude,infraEstructure.longitude),

        );

        return order;
    }
    
    async fromDomaintoPersistence(domainEntity: Order): Promise<OrmOrderEntity> {
        
        return OrmOrderEntity.create(
            domainEntity.getId().orderId,
            domainEntity.OrderState.orderState,
            domainEntity.OrderCreatedDate.OrderCreatedDate,
            domainEntity.TotalAmount.OrderAmount,
            domainEntity.TotalAmount.OrderCurrency,
            domainEntity.OrderDirection.Latitude,
            domainEntity.OrderDirection.Longitude,
            domainEntity.OrderReciviedDate.OrderReciviedDate,
        );
    }

}