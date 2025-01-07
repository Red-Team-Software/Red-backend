import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { Result } from "src/common/utils/result-handler/result";
import { Order } from "src/order/domain/aggregate/order";
import { IPaymentMethodService } from "src/order/domain/domain-services/interfaces/payment-method-interface";
import { OrderPayment } from "src/order/domain/entities/payment/order-payment-entity";
import { PaymentAmount } from "src/order/domain/entities/payment/value-object/payment-amount";
import { PaymentCurrency } from "src/order/domain/entities/payment/value-object/payment-currency";
import { PaymentId } from "src/order/domain/entities/payment/value-object/payment-id";
import { PaymentMethod } from "src/order/domain/entities/payment/value-object/payment-method";
import { OrderState } from "src/order/domain/value_objects/order-state";
import { UserId } from '../../../user/domain/value-object/user-id';
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { InsufficientFundsInWalletException } from "src/order/domain/exception/domain-services/insufficient-funds-in-wallet-exception";



export class WalletPaymentMethod implements IPaymentMethodService {    
    
    constructor(
        private readonly idGen: IIdGen<string>,
        private readonly queryUserRepository:IQueryUserRepository,

    ) {}

    async createPayment(order: Order): Promise<Result<Order>> {
        let userRes = await this.queryUserRepository.findUserById(UserId.create(order.OrderUserId.userId));

        let user = userRes.getValue;

        if (user.Wallet.Ballance.Amount < order.TotalAmount.OrderAmount) 
            return Result.fail( new InsufficientFundsInWalletException() );

        let newOrder = Order.registerOrder(
            order.getId(),
            OrderState.create('ongoing'),
            order.OrderCreatedDate,
            order.TotalAmount,
            order.OrderDirection,
            order.OrderCourier,
            order.OrderUserId,
            order.Products,
            order.Bundles,
            order.OrderReceivedDate, 
            order.OrderReport, 
            OrderPayment.create(
                PaymentId.create(await this.idGen.genId()),
                PaymentMethod.create('wallet'),
                PaymentAmount.create(order.TotalAmount.OrderAmount),
                PaymentCurrency.create(order.TotalAmount.OrderCurrency)
            )
        );
        return Result.success(newOrder);
    }
}