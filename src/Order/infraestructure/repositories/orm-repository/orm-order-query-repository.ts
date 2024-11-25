import { IQueryOrderRepository } from "src/order/application/query-repository/order-query-repository-interface";
import { OrmOrderEntity } from "../../entities/orm-order-entity";
import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmOrderPayEntity } from "../../entities/orm-order-payment";
import { FindAllOrdersApplicationServiceRequestDto } from "src/order/application/dto/request/find-all-orders-request.dto";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OrderId } from "src/order/domain/value_objects/orderId";


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
                relations: ["pay", "order_products", "order_bundles","order_report"]
            });

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

    async findOrderPaymentId(orderId: OrderId): Promise<Result<string>> {
        try {
            const ormOrder = await this.findOne({
                where: { id: orderId.orderId },
                relations: ["pay"]
            });

            if (!ormOrder || !ormOrder.pay) return Result.fail(new NotFoundException('Order or payment not found'));
            

            return Result.success(ormOrder.pay.id);
        } catch (error) {
            return Result.fail(new NotFoundException('Order or payment not found'));
        }
    }

    async findOrderById(orderId: OrderId): Promise<Result<Order>> {
        try {
            const ormOrder = await this.findOne({
                where: { id: orderId.orderId },
                relations: ["pay", "order_products", "order_bundles","order_report"]
            });

            if (!ormOrder) return Result.fail(new NotFoundException('Order not found'));

            const domainOrder = await this.orderMapper.fromPersistencetoDomain(ormOrder);
            return Result.success(domainOrder);
        } catch (error) {
            return Result.fail(new NotFoundException('Order not found'));
        }
    }

}