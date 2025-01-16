import { Model, Mongoose } from 'mongoose';
import { ICourierModel } from 'src/courier/application/model/courier-model-interface';
import { bundlesOrderRes, IOrderModel, productsOrderRes } from 'src/order/application/model/order.model.interface';
import { IQueryOrderRepository } from 'src/order/application/query-repository/order-query-repository-interface';
import { OdmOrder, OdmOrderSchema } from '../../entities/odm-entities/odm-order-entity';
import { Result } from 'src/common/utils/result-handler/result';
import { FindAllOrdersApplicationServiceRequestDto } from 'src/order/application/dto/request/find-all-orders-request.dto';
import { Order } from 'src/order/domain/aggregate/order';
import { OrderId } from 'src/order/domain/value_objects/order-id';
import { NotFoundException } from 'src/common/infraestructure/infraestructure-exception';
import { OdmOrderMapper } from '../../mappers/odm-mapper/odm-order-mapper';
import { OdmProduct, OdmProductSchema } from 'src/product/infraestructure/entities/odm-entities/odm-product-entity';
import { OdmBundle, OdmBundleSchema } from 'src/bundle/infraestructure/entities/odm-entities/odm-bundle-entity';
import { OdmCourier, OdmCourierSchema } from 'src/courier/infraestructure/entities/odm-entities/odm-courier-entity';

export class OdmOrderQueryRepository implements IQueryOrderRepository {

    private readonly orderModel: Model<OdmOrder>;
    private readonly productModel: Model<OdmProduct>;
    private readonly bundleModel: Model<OdmBundle>;
    private readonly courierModel: Model<OdmCourier>;
    private readonly odmOrderMapper: OdmOrderMapper;

    constructor( mongoose: Mongoose ) { 
        this.orderModel = mongoose.model<OdmOrder>('OdmOrder', OdmOrderSchema);
        this.productModel = mongoose.model<OdmProduct>('OdmProduct', OdmProductSchema);
        this.bundleModel = mongoose.model<OdmBundle>('OdmBundle', OdmBundleSchema);
        this.courierModel = mongoose.model<OdmCourier>('OdmCourier', OdmCourierSchema);
        this.odmOrderMapper = new OdmOrderMapper()
    }

    async transformToDataModel(odmOrder: OdmOrder): Promise<IOrderModel> {

    let productsOrderResponse: productsOrderRes[] = [];
    let bundlesOrderResponse: bundlesOrderRes[] = [];
    let courier: OdmCourier;

    let productDetail = odmOrder.product_details
    let bundleDetail = odmOrder.bundle_details

    if(productDetail){
        for (const product of productDetail){
            let p = await this.productModel.findOne({
                id: product.id
            });
            let productResponse = {
                id: p.id,
                name: p.name ,
                description: p.description,
                quantity: product.quantity,
                price: Number(product.price) ,
                images: p.image,
                currency: product.currency,
            }
            productsOrderResponse.push(productResponse);
        }
    }   

    if(bundleDetail){
        for (const bundle of bundleDetail){
            let b = await this.bundleModel.findOne({
                id: bundle.id
            }).exec();
            let bundleResponse = {
                id: b.id,
                name: b.name,
                description: b.description,
                quantity: bundle.quantity,
                price: Number(bundle.price),
                images: b.image,
                currency: bundle.currency,
            }
            bundlesOrderResponse.push(bundleResponse);
        }
    }

    if(odmOrder.courier_id){
        courier = await this.courierModel.findOne({
            id: odmOrder.courier_id
        }).exec();
    }

    let r: IOrderModel = {
        orderId: odmOrder.id,
        orderState: odmOrder.state,
        orderCreatedDate: odmOrder.createdDate,
        totalAmount: Number(Number(odmOrder.totalAmount).toFixed(2)),
        orderReceivedDate: odmOrder.receivedDate ? odmOrder.receivedDate : null,
        orderPayment: {
            paymetAmount: odmOrder.order_payment.amount,
            paymentCurrency: odmOrder.order_payment.currency,
            payementMethod: odmOrder.order_payment.paymentMethod,
        },
        orderDirection: {
            lat: odmOrder.latitude,
            long: odmOrder.longitude
        },
        products: productsOrderResponse,
        bundles: bundlesOrderResponse,
        orderReport: odmOrder.report ?
        {
            id: odmOrder.report.id,
            description: odmOrder.report.description
        }
        : null,
        orderCourier: odmOrder.courier_id 
        ? {
            courierId: courier.id,
            courierName: courier.name,
            courierImage: courier.image,
            location: {
                lat: courier.latitude,
                long: courier.longitude
            }
        }
        : null,
    }
        return r;
    }


    

    async findAllOrders(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        try{
            let odmOrders = await this.orderModel.find()
            .skip(data.page)
            .limit(data.perPage)
            .exec();

            if (!odmOrders) {
                return Result.fail( new NotFoundException('Orders not found'));
            }

            let orders: Order[] = [];

            for (const odmOrder of odmOrders) {
                let order = await this.odmOrderMapper.fromPersistencetoDomain(odmOrder);
                orders.push(order);
            }

            return Result.success(orders);

        }catch(e){
            console.log(e)
            return Result.fail( new NotFoundException('Orders not found'));
        };
    }

    async findAllOrdersByUser(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<Order[]>> {
        try{
            let odmOrders = await this.orderModel.find({user_id: data.userId})
            .skip(data.page)
            .limit(data.perPage)
            .exec();
            
            if (!odmOrders) {
                return Result.fail( new NotFoundException('Orders not found'));
            }

            let orders: Order[] = [];

            for (const odmOrder of odmOrders) {
                let order = await this.odmOrderMapper.fromPersistencetoDomain(odmOrder);
                orders.push(order);
            }

            return Result.success(orders);

        }catch(e){
            return Result.fail( new NotFoundException('Orders not found'));
        };
    }

    async findOrderById(orderId: OrderId): Promise<Result<Order>> {
        try{
            let odmOrder = await this.orderModel.findOne({id: orderId.orderId});

            if (!odmOrder) {
                return Result.fail( new NotFoundException('Order not found'));
            }

            let order = await this.odmOrderMapper.fromPersistencetoDomain(odmOrder);

            return Result.success(order);
        }catch(e){
            return Result.fail( new NotFoundException('Order not found'));
        };
    }

    async findAllOrdersDetails(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<IOrderModel[]>> {
        try{
            let odmOrders = await this.orderModel.find()
            .skip(data.page)
            .limit(data.perPage)
            .exec();

            if (!odmOrders) {
                return Result.fail( new NotFoundException('Orders not found'));
            }

            let orders: IOrderModel[] = [];

            for (const odmOrder of odmOrders) {
                let order = await this.transformToDataModel(odmOrder);
                orders.push(order);
            }

            return Result.success(orders);
        }catch(e){
            return Result.fail( new NotFoundException('Orders not found'));
        };
    }

    async findAllOrdersByUserDetails(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<IOrderModel[]>> {
        try{
            let odmOrders = await this.orderModel.find({user_id: data.userId})
            .skip(data.page)
            .limit(data.perPage)
            .exec();
            
            if (!odmOrders) {
                return Result.fail( new NotFoundException('Orders not found'));
            }

            let orders: IOrderModel[] = [];

            for (const odmOrder of odmOrders) {
                let order = await this.transformToDataModel(odmOrder);
                orders.push(order);
            }

            return Result.success(orders);
        }catch(e){
            console.log(e)
            return Result.fail( new NotFoundException('Orders not found'));
        };
    }

    async findOrderByIdDetails(orderId: OrderId): Promise<Result<IOrderModel>> {
        try{
            let odmOrder = await this.orderModel.findOne({id: orderId.orderId});

            if (!odmOrder) {
                return Result.fail( new NotFoundException('Order not found'));
            }

            let order = await this.transformToDataModel(odmOrder);

            return Result.success(order);
        }catch(e){
            return Result.fail( new NotFoundException('Orders not found'));
        };
    }

    

}