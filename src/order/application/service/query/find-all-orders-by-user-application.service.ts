import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { ICourierQueryRepository } from "src/courier/application/repository/query-repository/courier-query-repository-interface";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ErrorCreatingOrderBundleNotFoundApplicationException } from "../../application-exception/error-creating-order-bundle-not-found-application.exception";
import { ErrorCreatingOrderProductNotFoundApplicationException } from "../../application-exception/error-creating-order-product-not-found-application.exception";
import { NotFoundOrderApplicationException } from "../../application-exception/not-found-order-application.exception";
import { FindAllOrdersByUserApplicationServiceRequestDto } from "../../dto/request/find-all-orders-by-user-request.dto";
import { bundlesOrderResponse, FindAllOrdersApplicationServiceResponseDto, orderResponse, productsOrderResponse } from "../../dto/response/find-all-orders-response.dto";
import { courierOrderResponse } from "../../model/order.model.interface";
import { IQueryOrderRepository } from "../../query-repository/order-query-repository-interface";
import { productsOrderType, bundlesOrderType } from "../../types/get-all-orders-types";




export class FindAllOdersByUserApplicationService extends IApplicationService<FindAllOrdersByUserApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>{
    
    constructor(
        private readonly orderRepository: IQueryOrderRepository,
        private readonly productRepository:IQueryProductRepository,
        private readonly bundleRepository:IQueryBundleRepository,
        private readonly ormCourierQueryRepository: ICourierQueryRepository
    ){
        super()
    }
    
    async execute(data: FindAllOrdersByUserApplicationServiceRequestDto): Promise<Result<FindAllOrdersApplicationServiceResponseDto>> {

        data.page = data.page * data.perPage - data.perPage


        let response = await this.orderRepository.findAllOrdersByUserDetails(data);

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let orders = response.getValue;
    
        
        const ord = await Promise.all(
            orders.map(async order => {
            const summaryOrder = [
                ...order.products.map(product => `${product.name} (${product.quantity})`),
                ...order.bundles.map(bundle => `${bundle.name} (${bundle.quantity})`),
            ].join(', ');

            return {
                id: order.orderId,
                last_state: {
                    state: order.orderState,
                    date: new Date(),
                },
                totalAmount: order.totalAmount,
                summary_order: summaryOrder,
                };
            }),
        );

        

        return Result.success(new FindAllOrdersApplicationServiceResponseDto(ord));

    }
}