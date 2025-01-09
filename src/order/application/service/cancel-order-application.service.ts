import { IApplicationService } from "src/common/application/services";
import { CancelOrderApplicationServiceRequestDto } from "../dto/request/cancel-order-request-dto";
import { Result } from "src/common/utils/result-handler/result";
import { CancelOrderApplicationServiceResponseDto } from "../dto/response/cancel-order-response-dto";
import { IQueryOrderRepository } from "../query-repository/order-query-repository-interface";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { OrderId } from "src/order/domain/value_objects/order-id";
import { NotFoundOrderApplicationException } from "../application-exception/not-found-order-application.exception";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { ErrorModifiyingOrderStateApplicationException } from "../application-exception/error-modifying-order-status-application.exception";
import { IRefundPaymentService } from "src/order/domain/domain-services/interfaces/refund-amount.interface";
import { ErrorOrderAlreadyCancelledApplicationException } from "../application-exception/error-orden-already-cancelled-application.exception";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { UserNotFoundApplicationException } from "src/auth/application/application-exception/user-not-found-application-exception";
import { UserId } from "src/user/domain/value-object/user-id";
import { ErrorUpdatingBalanceWalletApplicationException } from "src/user/application/application-exeption/error-updating-wallet-balance-application-exception";
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance";
import { Wallet } from "src/user/domain/entities/wallet/wallet.entity";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";



export class CancelOderApplicationService extends IApplicationService<CancelOrderApplicationServiceRequestDto,CancelOrderApplicationServiceResponseDto>{

    constructor(
        private readonly orderQueryRepository: IQueryOrderRepository,
        private readonly orderRepository: ICommandOrderRepository,
        private readonly eventPublisher: IEventPublisher,
        private readonly refundPayment: IRefundPaymentService,
        private readonly commandUserRepository: ICommandUserRepository,
        private readonly queryUserRepository: IQueryUserRepository,
        private TransactionCommandRepository: ICommandTransactionRepository<ITransaction>,
        private readonly idGen: IIdGen<string>
    ){
        super()
    }

    async execute(data: CancelOrderApplicationServiceRequestDto): Promise<Result<CancelOrderApplicationServiceResponseDto>> {
        
        let response = await this.orderQueryRepository.findOrderById(OrderId.create(data.orderId));

        if (!response.isSuccess()) return Result.fail(new NotFoundOrderApplicationException());

        let newOrder = response.getValue;

        if (newOrder.OrderState.orderState === 'cancelled') return Result.fail(
            new ErrorOrderAlreadyCancelledApplicationException('The order is already cancelled')
        );

        let userResponse= await this.queryUserRepository.findUserById(UserId.create(data.userId));
                
        if (!userResponse.isSuccess())
            return Result.fail(new UserNotFoundApplicationException())
                
        let user = userResponse.getValue;

        newOrder.cancelOrder(OrderState.create('cancelled'));
        
        await this.refundPayment.refundPayment(newOrder);

        let newBalance = Ballance.create(
            Number(user.Wallet.Ballance.Amount) + Number(newOrder.TotalAmount.OrderAmount), 
            user.Wallet.Ballance.Currency
        );
        
        let newWallet = Wallet.create(user.Wallet.getId(), newBalance);
        
        user.addWalletBalance(newWallet);

        let userRes = await this.commandUserRepository.saveUser(user);
        
        if (!userRes.isSuccess())
            return Result.fail(new ErrorUpdatingBalanceWalletApplicationException());

        let responseCommand = await this.orderRepository.saveOrder(newOrder);

        if (!responseCommand.isSuccess()) 
            return Result.fail(new ErrorModifiyingOrderStateApplicationException());

        let transaction: ITransaction = {
            id: await this.idGen.genId(),
            currency: user.Wallet.Ballance.Currency,
            price: -newOrder.TotalAmount.OrderAmount,
            wallet_id: user.Wallet.getId().Value,
            payment_method_id: '',
            date: new Date()
        }

        let trans = await this.TransactionCommandRepository.saveTransaction(transaction);

        await this.eventPublisher.publish(newOrder.pullDomainEvents())

        let responseDto: CancelOrderApplicationServiceResponseDto = {
            orderId: newOrder.getId().orderId,
            state: newOrder.OrderState.orderState
        };

        return Result.success(responseDto);
    }

}
