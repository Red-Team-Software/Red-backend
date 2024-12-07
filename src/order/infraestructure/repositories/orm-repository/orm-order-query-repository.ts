import { productsOrderResponse, bundlesOrderResponse } from './../../../application/dto/response/find-all-orders-response.dto';
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
import { IOrderModel } from "src/order/application/model/order.model.interface";
import { OrmUserEntity } from 'src/user/infraestructure/entities/orm-entities/orm-user-entity';


export class OrderQueryRepository extends Repository<OrmOrderEntity> implements IQueryOrderRepository {
    
    private orderMapper: IMapper<Order,OrmOrderEntity>;
    private readonly ormOrderPayRepository: Repository<OrmOrderPayEntity>;
    private readonly ormOrderUser: Repository<OrmUserEntity>;


    constructor( 
        dataSource: DataSource,
        orderMapper: IMapper<Order,OrmOrderEntity>
    ) {
        super( OrmOrderEntity, dataSource.createEntityManager());
        this.orderMapper = orderMapper;
        this.ormOrderPayRepository = dataSource.getRepository(OrmOrderPayEntity);
        this.ormOrderUser=dataSource.getRepository(OrmUserEntity)
    }
    async findAllOrdersByUser(data: FindAllOrdersApplicationServiceRequestDto): 
    Promise<Result<Order[]>> {
        try {
            const ormOrders = await this.find({
                relations: 
                ["pay", "order_products", "order_bundles","order_report","order_courier", "user"],
                where:{userId: data.userId},
                skip:data.page,
                take:data.perPage
            },
            )
                        
            let domainOrders: Order[] = [];

            for(let ormOrder of ormOrders){
                let or = await this.orderMapper.fromPersistencetoDomain(ormOrder)
                domainOrders.push(or);
            };

            return Result.success(domainOrders);
        } catch (error) {
            console.log(error)
            return Result.fail(new NotFoundException('Orders empty, please try again'));
        }
    }
    
    async findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        try {
            const ormOrders = await this.find({
                relations: ["pay", "order_products", "order_bundles","order_report","order_courier", "user"],
                order: { orderCreatedDate: 'DESC' },
                skip:data.page,
                take:data.perPage
            });
            
                if(!ormOrders) return Result.fail( new NotFoundException('Orders empty, please try again'))
            
                let domainOrders: Order[] = [];

                for(let ormOrder of ormOrders){
                    let or = await this.orderMapper.fromPersistencetoDomain(ormOrder)
                    domainOrders.push(or);
                };

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