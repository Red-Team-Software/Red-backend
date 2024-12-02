import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { Repository, DataSource } from 'typeorm';
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmOrderEntity } from "../../entities/orm-order-entity";


export class OrmOrderRepository extends Repository<OrmOrderEntity> implements ICommandOrderRepository {
    
    private readonly orderMapper: IMapper<Order,OrmOrderEntity>;

    constructor( 
        dataSource: DataSource,
        orderMapper: IMapper<Order,OrmOrderEntity>
    ) {
        super( OrmOrderEntity, dataSource.createEntityManager());
        this.orderMapper = orderMapper;
    }

    async saveOrder(order: Order): Promise<Result<Order>> {
        try {
            let orderEntity = await this.orderMapper.fromDomaintoPersistence(order);
            await this.save(orderEntity);
            return Result.success(order);
        } catch (error) {
            console.log(error);
            return Result.fail( new PersistenceException( 'Create order unsucssessfully' ) );
        }
    }

}
