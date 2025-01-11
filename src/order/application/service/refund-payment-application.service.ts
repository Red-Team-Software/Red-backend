import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { CancelOrderApplicationServiceResponseDto } from "../dto/response/cancel-order-response-dto";
import { IQueryOrderRepository } from "../query-repository/order-query-repository-interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { NotFoundOrderApplicationException } from "../application-exception/not-found-order-application.exception";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IRefundPaymentService } from "src/order/domain/domain-services/interfaces/refund-amount.interface";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { UserId } from "src/user/domain/value-object/user-id";
import { ErrorUpdatingBalanceWalletApplicationException } from "src/user/application/application-exeption/error-updating-wallet-balance-application-exception";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { RefundPaymentApplicationServiceRequestDto } from "../dto/request/refund-payment-request-dto";
import { RefundPaymentApplicationServiceResponseDto } from "../dto/response/refund-payment-response-dto";



export class RefundPaymentApplicationService extends IApplicationService<RefundPaymentApplicationServiceRequestDto,RefundPaymentApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly refundPayment: IRefundPaymentService,
        private readonly commandUserRepository: ICommandUserRepository,
        private readonly queryUserRepository: IQueryUserRepository,
        private TransactionCommandRepository: ICommandTransactionRepository<ITransaction>,
        private readonly idGen: IIdGen<string>
    ){
        super()
    }

    async execute(data: RefundPaymentApplicationServiceRequestDto): Promise<Result<RefundPaymentApplicationServiceResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let order = response.getValue;

        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
                
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException(data.userId))
                
        let user = userResponse.getValue;
        
        await this.refundPayment.refundPayment(order);

        let newBalance = Ballance.create(
            Number(order.TotalAmount.OrderAmount), 
            user.Wallet.Ballance.Currency
        );
        
        user.addWalletBalance(newBalance);

        let userRes = await this.commandUserRepository.updateUser(user);
        
        if (!userRes.isSuccess())
            return Result.fail(new ErrorUpdatingBalanceWalletApplicationException());

        
        let transaction: ITransaction = {
            id: await this.idGen.genId(),
            currency: user.Wallet.Ballance.Currency,
            price: order.TotalAmount.OrderAmount,
            wallet_id: user.Wallet.getId().Value,
            payment_method_id: '',
            date: new Date()
        }

        let trans = await this.TransactionCommandRepository.saveTransaction(transaction);

        await this.eventPublisher.publish(order.pullDomainEvents())

        let responseDto: CancelOrderApplicationServiceResponseDto = {
            orderId: order.getId().orderId,
            state: order.OrderState.orderState
        };

        return Result.success(responseDto);
    }

}
