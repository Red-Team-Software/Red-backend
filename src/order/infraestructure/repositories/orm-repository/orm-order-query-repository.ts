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
    async findAllOrdersByUser(data: FindAllOrdersApplicationServiceRequestDto): 
    Promise<Result<IOrderModel[]>> {
        try {

            let ormOrders = await this.createQueryBuilder('order')
            .innerJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.order_products', 'order_product')
            .leftJoinAndSelect('order.order_bundles', 'order_bundle')
            .leftJoinAndSelect('order.order_report', 'order_report')
            .leftJoinAndSelect('order.order_courier', 'order_courier')
            .leftJoinAndSelect('order_courier.courier', 'courier')
            .skip(data.page)
            .take(data.perPage)
            .getMany();

            // return Result.success(ormOrders.map(ormOrder=>({
            //     orderId: ormOrder.id,
            //     orderState: ormOrder.state,
            //     orderCreatedDate: ormOrder.orderCreatedDate,
            //     orderTimeCreated: ormOrder.orderCreatedDate,
            //     totalAmount: ormOrder.totalAmount,
            //     orderReceivedDate: ormOrder.orderReceivedDate
            //     ? ormOrder.orderReceivedDate
            //     : null,
            //     orderPayment: ormOrder.pay
            //     ? {
            //         paymetAmount: ormOrder.pay.amount,
            //         paymentCurrency: ormOrder.pay.currency,
            //         payementMethod: ormOrder.pay.paymentMethod
            //     }
            //     : null,
            //     orderDirection: {
            //         lat: ormOrder.latitude,
            //         long: ormOrder.longitude
            //     },
            //     products:ormOrder.order_products
            //     ? ormOrder.order_products.map(product=>({
            //         id: product.product.id,
            //         name: product.product.name, 
            //         descripcion: product.product.desciption,
            //         quantity: product.quantity,
            //         price:product.product.price, 
            //         images:product.product.images.map(image=>image.image),
            //         currency:product.product.currency,
            //         orderid: ormOrder.id
            //     }))
            //     : []
            // })))
        } catch (error) {
            console.log(error)                
            return Result.fail(new NotFoundException('Orders search error, please try again'));
        }
    }
    
    async findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        try {
            const ormOrders = await this.find({
                relations: ["pay", "order_products", "order_bundles","order_report","order_courier", "user"]
            });
            
                if(!ormOrders) return Result.fail( new NotFoundException('Orders empty, please try again'))
            
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