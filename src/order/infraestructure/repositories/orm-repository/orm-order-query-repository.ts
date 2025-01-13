import { IQueryOrderRepository } from "src/order/application/query-repository/order-query-repository-interface";
import { OrmOrderEntity } from "../../entities/orm-entities/orm-order-entity";
import { DataSource, Repository } from "typeorm";
import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { FindAllOrdersApplicationServiceRequestDto } from "src/order/application/dto/request/find-all-orders-request.dto";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { bundlesOrderRes, IOrderModel, productsOrderRes } from "src/order/application/model/order.model.interface";
import { OrmUserEntity } from 'src/user/infraestructure/entities/orm-entities/orm-user-entity';
import { OrmOrderPayEntity } from "../../entities/orm-entities/orm-order-payment";


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

    transformToDataModel(ormOrder: OrmOrderEntity): IOrderModel {

    let productsOrderResponse: productsOrderRes[] = [];
    let bundlesOrderResponse: bundlesOrderRes[] = [];

    let productDetail = ormOrder.order_products
    let bundleDetail = ormOrder.order_bundles

    if(productDetail){
        for (const product of productDetail){
            let productResponse = {
                id: product.product_id,
                name: product.product.name ,
                description: product.product.desciption,
                quantity: product.quantity,
                price: Number(product.price) ,
                images:product.product.images.map(image=>image.image),
                currency:product.product.currency,
            }
            productsOrderResponse.push(productResponse);
        }
    }   

    if(bundleDetail){
        for (const bundle of bundleDetail){
            let bundleResponse = {
                id: bundle.bundle_id,
                name: bundle.bundle.name,
                description: bundle.bundle.desciption,
                quantity: bundle.quantity,
                price: Number(bundle.price),
                images: bundle.bundle.images.map(image=>image.image),
                currency: bundle.currency,
            }
            bundlesOrderResponse.push(bundleResponse);
        }
    }

    let r: IOrderModel = {
        orderId: ormOrder.id,
        orderState: ormOrder.state,
        orderCreatedDate: ormOrder.orderCreatedDate,
        totalAmount: Number(Number(ormOrder.totalAmount).toFixed(2)),
        orderReceivedDate: ormOrder.orderReceivedDate ? ormOrder.orderReceivedDate : null,
        orderPayment: {
            paymetAmount: ormOrder.pay.amount,
            paymentCurrency: ormOrder.pay.currency,
            payementMethod: ormOrder.pay.paymentMethod,
        },
        orderDirection: {
            lat: ormOrder.latitude,
            long: ormOrder.longitude
        },
        products: productsOrderResponse,
        bundles: bundlesOrderResponse,
        orderReport: ormOrder.order_report ?
        {
            id: ormOrder.order_report.id,
            description: ormOrder.order_report.description
        }
        : null,
        orderCourier: ormOrder.order_courier 
        ? {
            courierId: ormOrder.order_courier.id,
            courierName: ormOrder.order_courier.name,
            courierImage: ormOrder.order_courier.image.image,
            location: {
                lat: ormOrder.order_courier.latitude,
                long: ormOrder.order_courier.longitude
            }
        }
        : null,
    }
                
            
        
        return r;
    }


    async findAllOrdersByUser(data: FindAllOrdersApplicationServiceRequestDto): 
    Promise<Result<Order[]>> {
        try {
            const ormOrders = await this.find({
                relations: 
                ["pay", "order_products", "order_bundles","order_report", "user", "order_courier"],
                where:{userId: data.userId},
                skip:data.page,
                take:data.perPage
            },
            )


            let domainOrders: Order[] = [];

            

            return Result.success(domainOrders);
        } catch (error) {
            return Result.fail(new NotFoundException('Orders empty, please try again'));
        }
    }
    
    async findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        try {
            const ormOrders = await this.find({
                relations: ["pay", "order_products", "order_bundles","order_report", "user", "order_courier"],
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
                relations: ["pay", "order_products", "order_bundles","order_report", "user", "order_courier"]
            });

            if (!ormOrder) return Result.fail(new NotFoundException('Order not found'));

            const domainOrder = await this.orderMapper.fromPersistencetoDomain(ormOrder);
            return Result.success(domainOrder);
        } catch (error) {
            return Result.fail(new NotFoundException('Order not found'));
        }
    }

    async findAllOrdersByUserDetails(data: FindAllOrdersApplicationServiceRequestDto): 
    Promise<Result<IOrderModel[]>> {
        try {
            const ormOrders = await this.find({
                relations: 
                ["pay", "order_products", "order_bundles","order_report", "user", "order_courier"],
                where:{userId: data.userId},
                skip:data.page,
                take:data.perPage
            },
            )

            let modelOrders: IOrderModel[] = [];

            if (data.state){
                for(let ormOrder of ormOrders){
                    if(data.state === "active" && (ormOrder.state == "ongoing" ||
                        ormOrder.state == "waiting" || ormOrder.state == "delivering")) {
                            modelOrders.push( this.transformToDataModel(ormOrder));
                    } 
                    
                    if(data.state === "past" && (ormOrder.state === "cancelled" ||
                        ormOrder.state === "delivered")) {
                            modelOrders.push( this.transformToDataModel(ormOrder));
                    }
                };
            } else {
                modelOrders = ormOrders.map((ormOrder) => this.transformToDataModel(ormOrder));
            }


            //let modelOrders = ormOrders.map((ormOrder) => this.transformToDataModel(ormOrder));

            return Result.success(modelOrders);
        } catch (error) {
            console.log(error)
            return Result.fail(new NotFoundException('Orders empty, please try again'));
        }
    }

    async findOrderByIdDetails(orderId: OrderId): Promise<Result<IOrderModel>> {
        try {
            const ormOrder = await this.findOne({
                where: { id: orderId.orderId },
                relations: ["pay", "order_products", "order_bundles","order_report", "user", "order_courier"]
            });

            if (!ormOrder) return Result.fail(new NotFoundException('Order not found'));

            let modelOrders = this.transformToDataModel(ormOrder);

            return Result.success(modelOrders);
        } catch (error) {
            return Result.fail(new NotFoundException('Order not found'));
        }
    }

    async findAllOrdersDetails(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<IOrderModel[]>> {
        try {
            const ormOrders = await this.find({
                relations: ["pay", "order_products", "order_bundles","order_report", "user", "order_courier"],
                order: { orderCreatedDate: 'DESC' },
                skip:data.page,
                take:data.perPage
            });
            
            if(!ormOrders) return Result.fail( new NotFoundException('Orders empty, please try again'))
            
            let modelOrders: IOrderModel[] = [];

            if (data.state){
                for(let ormOrder of ormOrders){
                    if(data.state === "active" && (ormOrder.state == "ongoing" ||
                        ormOrder.state == "waiting" || ormOrder.state == "delivering")) {
                            modelOrders.push( this.transformToDataModel(ormOrder));
                    } 
                    
                    if(data.state === "past" && (ormOrder.state === "cancelled" ||
                        ormOrder.state === "delivered")) {
                            modelOrders.push( this.transformToDataModel(ormOrder));
                    }
                };
            } else {
                modelOrders = ormOrders.map((ormOrder) => this.transformToDataModel(ormOrder));
            }
            return Result.success(modelOrders);
        } catch (error) {
            return Result.fail(new NotFoundException('Orders empty, please try again'));
        }
    }

}