import { IQueryOrderRepository } from "src/order/application/query-repository/order-query-repository-interface";
import { OrmOrderEntity } from "../../entities/orm-order-entity";
import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmOrderPayEntity } from "../../entities/orm-order-payment";
import { FindAllOrdersApplicationServiceRequestDto } from "src/order/application/dto/request/find-all-orders-request.dto";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OrderId } from "src/order/domain/value_objects/order-id";


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
            const ormOrders = await this.find({
                relations: ["pay", "order_products", "order_bundles","order_report","order_courier", "user"]
            });
            
                if(!ormOrders || ormOrders.length === 0) return Result.fail( new NotFoundException('Orders empty, please try again'))
            
                let domainOrders: Order[] = [];

                for(let ormOrder of ormOrders){
                    let or = await this.orderMapper.fromPersistencetoDomain(ormOrder)
                    domainOrders.push(or);
                };

                if (data.perPage) {
                    let page = data.page;
                    if (!page) {page = 0}
        
                    domainOrders = domainOrders.slice((page*data.perPage), (data.perPage) + (page*data.perPage));
                }

            return Result.success(domainOrders);
        } catch (error) {
            return Result.fail(new NotFoundException('Orders empty, please try again'));
        }
    }

    async findOrderById(orderId: OrderId): Promise<Result<Order>> {
        try {
            const ormOrder = await this.findOne({
                where: { id: orderId.orderId },
                relations: ["pay", "order_products", "order_bundles","order_report","order_courier", "user"]
            });

            if (!ormOrder) return Result.fail(new NotFoundException('Order not found'));

            const domainOrder = await this.orderMapper.fromPersistencetoDomain(ormOrder);
            return Result.success(domainOrder);
        } catch (error) {
            return Result.fail(new NotFoundException('Order not found'));
        }
    }

}