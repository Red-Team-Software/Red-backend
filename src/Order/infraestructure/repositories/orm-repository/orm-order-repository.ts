import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/Order/domain/aggregate/order";
import { ICommandOrderRepository } from "src/Order/domain/command-repository/order-command-repository-interface";
import { Repository, DataSource } from 'typeorm';
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmOrderEntity } from "../../entities/orm-order-entity";
import { OrmOrderPayEntity } from "../../entities/orm-order-payment";


export class OrmOrderRepository extends Repository<OrmOrderEntity> implements ICommandOrderRepository {
    
    private orderMapper: IMapper<Order,OrmOrderEntity>;
    private readonly ormOrderPayRepository: Repository<OrmOrderPayEntity>;

    constructor( 
        dataSource: DataSource,
        orderMapper: IMapper<Order,OrmOrderEntity>
    ) {
        super( OrmOrderEntity, dataSource.createEntityManager());
        this.orderMapper = orderMapper;
        this.ormOrderPayRepository = dataSource.getRepository(OrmOrderPayEntity);
    }

    async saveOrder(order: Order): Promise<Result<Order>> {
        console.log("entre");
        try {
            console.log('Order: ', order);
            let orderEntity = await this.orderMapper.fromDomaintoPersistence(order);
            console.log('OrderEntity: ', orderEntity);
            await this.save(orderEntity);
            await this.ormOrderPayRepository.save(orderEntity.pay);
            console.log('termine')
            return Result.success(order);
        } catch (error) {
            return Result.fail( new PersistenceException( 'Create order unsucssessfully' ) );
        }
    }
}
