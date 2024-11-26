import { IApplicationService} from 'src/common/application/services';
import { Result } from 'src/common/utils/result-handler/result';
import { IQueryOrderRepository } from '../query-repository/order-query-repository-interface';
import { NotFoundOrderApplicationException } from '../application-exception/not-found-order-application.exception';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { IProductRepository } from 'src/product/domain/repository/product.interface.repositry';
import { IBundleRepository } from 'src/bundle/domain/repository/product.interface.repositry';
import { ErrorCreatingOrderProductNotFoundApplicationException } from '../application-exception/error-creating-order-product-not-found-application.exception';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { ErrorCreatingOrderBundleNotFoundApplicationException } from '../application-exception/error-creating-order-bundle-not-found-application.exception';
import { FindAllOrdersApplicationServiceRequestDto } from '../dto/request/find-all-orders-request.dto';
import { FindAllOrdersApplicationServiceResponseDto, order } from '../dto/response/find-all-orders-response.dto';


export type productsOrder = {
    quantity: number
    nombre: string 
    descripcion: string
    price:number 
    images:string[]
    currency:string
}


export class FindAllOdersApplicationService extends IApplicationService<FindAllOrdersApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository,
        private readonly productRepository:IProductRepository,
        private readonly bundleRepository:IBundleRepository
    ){
        super()
    }
    
    async execute(data: FindAllOrdersApplicationServiceRequestDto): Promise<Result<FindAllOrdersApplicationServiceResponseDto>> {

        let response = await this.orderRepository.findAllOrders(data);

        if (!response.isSuccess) return Result.fail(new NotFoundOrderApplicationException());

        let orders = response.getValue;

        let products;  
        let bundles; 
        
        orders.forEach( (order) => { 
            if (order.Products) products.push(order.Products);
            if (order.Bundles) bundles.push(order.Bundles);
        });

        let domainProducts=[]
        let domainBundles=[]

        if(products){
            for (const product of products){
                let domain=await this.productRepository.findProductById(ProductID.create(product.id))

                if(!domain.isSuccess())
                    return Result.fail(new ErrorCreatingOrderProductNotFoundApplicationException())

                domainProducts.push(domain.getValue)
            }

        }

        if(bundles){
            for (const bundle of bundles){
                let domain=await this.bundleRepository.findBundleById(BundleId.create(bundle.id))

                if(!domain.isSuccess()) return Result.fail(new ErrorCreatingOrderBundleNotFoundApplicationException())
                domainBundles.push(domain.getValue)
            }
        }

        let ordersDto: order[] = [];

        orders.forEach( (order) => {
            ordersDto.push({
                orderId: order.getId().orderId,
                orderState: order.OrderState.orderState,
                orderCreatedDate: order.OrderCreatedDate.OrderCreatedDate,
                totalAmount: order.TotalAmount.OrderAmount,
                orderReceivedDate: order.OrderReceivedDate.OrderReceivedDate,
                orderPayment: {
                    paymetAmount: order.OrderPayment.PaymentAmount.Value,
                    paymentCurrency: order.OrderPayment.PaymentCurrency.Value,
                    payementMethod: order.OrderPayment.PaymentMethods.Value
                }
            })
        });

        return Result.success(new FindAllOrdersApplicationServiceResponseDto(ordersDto));
    }
}