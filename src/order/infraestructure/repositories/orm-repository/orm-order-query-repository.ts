import { IQueryOrderRepository } from "src/order/application/query-repository/order-query-repository-interface";
import { OrmOrderEntity } from "../../entities/orm-order-entity";
import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmOrderPayEntity } from "../../entities/orm-order-payment";
import { FindAllOrdersApplicationServiceRequestDto } from "src/order/application/dto/request/find-all-orders-request.dto";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";


export class OrderQueryRepository extends Repository<OrmOrderEntity> implements IQueryOrderRepository {
    
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
    
    async findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        try {
            const ormOrders = await this.createQueryBuilder("order")
                .leftJoinAndSelect("order.pay", "payment")
                .getMany();

                if(ormOrders.length==0) return Result.fail( new NotFoundException('products empty please try again'))
            
                let domainOrders: Order[] = [];

                ormOrders.forEach( async (ormOrder) => {
                    domainOrders.push(await this.orderMapper.fromPersistencetoDomain(ormOrder));
                });

                if (data.perPage) {
                    let page = data.page;
                    if (!page) {page = 0}
        
                    domainOrders = domainOrders.slice((page*data.perPage), (data.perPage) + (page*data.perPage));
                }

            return Result.success(domainOrders);
        } catch (error) {
            return Result.fail(new NotFoundException('products empty please try again'));
        }
    }
}