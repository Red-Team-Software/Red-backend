import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/Order/domain/aggregate/order";
import { ICommandOrderRepository } from "src/Order/domain/command-repository/order-command-repository-interface";
import { Repository, DataSource } from 'typeorm';
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmOrderEntity } from "../../entities/orm-order-entity";
import { OrmOrderPayEntity } from "../../entities/orm-order-payment";
import { OrmOrderProductEntity } from "../../entities/orm-order-product-entity";
import { OrmOrderBundleEntity } from "../../entities/orm-order-bundle-entity";


export class OrmOrderRepository extends Repository<OrmOrderEntity> implements ICommandOrderRepository {
    
    private readonly orderMapper: IMapper<Order,OrmOrderEntity>;
    private readonly ormOrderPayRepository: Repository<OrmOrderPayEntity>;
    private readonly ormOrderProductRepository: Repository<OrmOrderProductEntity>;
    private readonly ormOrderBundleRepository: Repository<OrmOrderBundleEntity>;

    constructor( 
        dataSource: DataSource,
        orderMapper: IMapper<Order,OrmOrderEntity>
    ) {
        super( OrmOrderEntity, dataSource.createEntityManager());
        this.orderMapper = orderMapper;
        this.ormOrderPayRepository = dataSource.getRepository(OrmOrderPayEntity);
        this.ormOrderProductRepository = dataSource.getRepository(OrmOrderProductEntity);
        this.ormOrderBundleRepository = dataSource.getRepository(OrmOrderBundleEntity);
    }

    async saveOrder(order: Order): Promise<Result<Order>> {
        try {
            let orderEntity = await this.orderMapper.fromDomaintoPersistence(order);
            console.log(orderEntity);
            await this.ormOrderPayRepository.save(orderEntity.pay);
            await this.save(orderEntity);
            await this.ormOrderProductRepository.save(orderEntity.order_products);
            await this.ormOrderBundleRepository.save(orderEntity.order_bundles);
            return Result.success(order);
        } catch (error) {
            console.log(error);
            return Result.fail( new PersistenceException( 'Create order unsucssessfully' ) );
        }
    }
}
