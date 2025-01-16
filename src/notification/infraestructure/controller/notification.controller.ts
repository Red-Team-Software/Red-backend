import { Body, Controller, Inject, Logger, Post, UseGuards } from "@nestjs/common";
import { Channel } from "amqp-connection-manager";
import { FirebaseNotifier } from '../firebase-notifier/firebase-notifier-singleton';
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { NewProductPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/new-product-push-notification-application-request-dto";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { SaveTokenInfraestructureEntryDTO } from "../dto-request/save-token-infraestructure-entry-dto";
import { ICreateBundle } from "../interfaces/create-bundle.interface";
import { SendGridNewBundleEmailSender } from "src/common/infraestructure/email-sender/send-grid-new-bundle-email-sender.service";
import { SendGridNewProductEmailSender } from "src/common/infraestructure/email-sender/send-grid-new-product-email-sender.service";
import { NewBundlePushNotificationApplicationService } from "src/notification/application/services/command/new-bundle-push-notification-application.service";
import { NewProductsPushNotificationApplicationService } from "src/notification/application/services/command/new-product-push-notification-application.service";
import { SendGridNewOrderEmailSender } from "src/common/infraestructure/email-sender/send-grid-new-order-email-sender.service";
import { NewOrderPushNotificationApplicationService } from "src/notification/application/services/command/new-order-push-notification-application.service";
import { NewOrderPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/new-order-push-notification-application-request-dto";
import { ICreateCupon } from "../interfaces/create-cupon.interface";
import { NewCuponPushNotificationApplicationService } from "src/notification/application/services/command/new-cupon-push-notification-application.service";
import { NewCuponPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/new-cupon-push-notification-application-request-dto";
import { CancelOrderPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/cancel-order-push-notification-application-request-dto";
import { CancelledOrderPushNotificationApplicationService } from "src/notification/application/services/command/cancel-order-push-notification-application.service";
import { SendGridCancelledOrderEmailSender } from "src/common/infraestructure/email-sender/send-grid-cancelled-order-email-sender.service";
import { ICreateOrder } from "../interfaces/create-order.interface";
import { ICancelOrder } from "../interfaces/cancel-order.interface";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard";
import { ICredential } from "src/auth/application/model/credential.interface";
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator";
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface";
import { ISession } from "src/auth/application/model/session.interface";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface";
import { IAccount } from "src/auth/application/model/account.interface";
import { IQueryTokenSessionRepository } from "src/auth/application/repository/query-token-session-repository.interface";
import { OrmAccountQueryRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-account-query-repository";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";
import { OrmTokenQueryRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-token-query-session-repository";
import { OrmTokenCommandRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-token-command-session-repository";
import { IDeliveredOrder } from "../interfaces/delivered-order.interface";
import { OrderDeliveredPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/order-delivered-push-notification-application-request-dto";
import { OrderDeliveredPushNotificationApplicationService } from "src/notification/application/services/command/order-delivered-push-notification-application.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateTokenPushNotificationApplicationService } from "src/notification/application/services/command/update-token-push-notification-application.service";
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator";
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator";
import { IAuditRepository } from "src/common/application/repositories/audit.repository";
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository";
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler";
import { NestTimer } from "src/common/infraestructure/timer/nets-timer";
import { IDeliveringOrder } from "../interfaces/delivering-order.interface";
import { OrderDeliveringPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/order-delivering-push-notification-application-request-dto";
import { NewBundlePushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/new-bundle-push-notification-application-request-dto";
import { NotificationQueues } from "../queues/notification.queues";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrderDeliveringPushNotificationApplicationService } from "src/notification/application/services/command/order-delivering-push-notification-application.service";
import { IUserWalletBalanceAdded } from "../interfaces/user-wallet-balance-updated";
import { UserWalletBalanceAddedPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/user-wallet-balance-added-push-notification-application-request-dto";
import { UpdateUserWalletBalancePushNotificationApplicationService } from "src/notification/application/services/command/update-user-wallet-balance-push-notification-application.service";
import { CourierAssignedToDeliver } from "src/order/domain/domain-events/courier-assigned-to-deliver";

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {

    private readonly subscriber:RabbitMQSubscriber;
    private readonly pushsender:IPushNotifier;
    private readonly commandTokenSessionRepository:ICommandTokenSessionRepository<ISession>;
    private readonly queryAccountRepository:IQueryAccountRepository<IAccount>;
    private readonly querySessionRepository:IQueryTokenSessionRepository<ISession>;
    private readonly auditRepository: IAuditRepository

    private initializeQueues():void{        
        NotificationQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
    }

    private buildQueue(name: string, pattern: string) {
        this.subscriber.buildQueue({
          name,
          pattern,
          exchange: {
            name: 'DomainEvent',
            type: 'direct',
            options: {
              durable: false,
            },
          },
        })
    }

    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ){
        this.pushsender=FirebaseNotifier.getInstance();
        this.subscriber=new RabbitMQSubscriber(this.channel);
        this.commandTokenSessionRepository= new OrmTokenCommandRepository(PgDatabaseSingleton.getInstance());
        this.queryAccountRepository= new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance());
        this.querySessionRepository= new OrmTokenQueryRepository(PgDatabaseSingleton.getInstance());
        this.auditRepository=new OrmAuditRepository(PgDatabaseSingleton.getInstance())

        this.initializeQueues()

        this.subscriber.consume<IUserWalletBalanceAdded>(
            { name: 'UserEvents'}, 
            (data):Promise<void>=>{
                this.sendPushUserWalletBalanceAdded(data)
                return
            }
        );

        this.subscriber.consume<ICreateProduct>(
            { name: 'ProductEvents/ProductRegistered'}, 
            (data):Promise<void>=>{
                this.sendEmailToCreateProduct(data)
                this.sendPushToCreatedProduct(data)
                return
            }
        );

        this.subscriber.consume<ICreateBundle>(
            { name: 'BundleEvents/BundleRegistered'}, 
            (data):Promise<void>=>{
                this.sendPushToCreatedBundle(data)
                this.sendEmailToCreateBundle(data)
                return
            }
        );

        this.subscriber.consume<ICreateOrder>(
            { name: 'OrderEvents/OrderRegistered'}, 
            (data):Promise<void>=>{
                this.sendPushOrderCreated(data)
                this.sendEmailOrderCreated(data)
                return
            }
        )
        
        this.subscriber.consume<ICreateCupon>(
            { name: 'CuponEvents/Createcupon'}, 
            (data):Promise<void>=>{
                this.sendPushCuponCreated(data)
                return
            }
        )

        this.subscriber.consume<ICancelOrder>(
            { name: 'OrderEvents/CancelOrder'}, 
            (data):Promise<void>=>{
                this.sendPushOrderCancelled(data)
                this.sendEmailOrderCancelled(data)
                return
            }
        );

        this.subscriber.consume<IDeliveredOrder>(
            { name: 'OrderEvents/OrderStatusDelivered'}, 
            (data):Promise<void>=>{
                this.sendPushOrderDelivered(data)
                return
            }
        );

        this.subscriber.consume<IDeliveringOrder>(
            { name: 'OrderEvents/CourierAssignedToDeliver'}, 
            (data):Promise<void>=>{
                this.sendPushOrderDelivering(data)
                return
            }
        );

    }

    
    async sendPushCuponCreated(entry:ICreateCupon){
        let service=new ExceptionDecorator(
            new LoggerDecorator(
                new NewCuponPushNotificationApplicationService(
                    this.pushsender
                ),
                new NestLogger(new Logger())
            )
        )

        const tokensResponse=await this.querySessionRepository.findAllLastTokenSessions();

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError;

        let data:NewCuponPushNotificationApplicationRequestDTO={
            userId:'none',
            tokens:tokensResponse.getValue,
            name:entry.cuponName,
            discount: entry.cuponDiscount,
            code:entry.cuponCode,
            state:entry.cuponState
        }
        service.execute(data);

    }

    async sendPushUserWalletBalanceAdded(entry:IUserWalletBalanceAdded){
        
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new UpdateUserWalletBalancePushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        );
        
        const tokensResponse = await this.querySessionRepository.findSessionLastSessionByUserId(
            UserId.create(entry.userId)
        );

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError;
        
        let data:UserWalletBalanceAddedPushNotificationApplicationRequestDTO={
            userId: entry.userId,
            tokens:[tokensResponse.getValue.push_token],
            userWallet:entry.userWallet
        };
        service.execute(data);
    };

    async sendPushOrderDelivering(entry:IDeliveringOrder){
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new OrderDeliveringPushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        )
        
        const tokensResponse=await this.querySessionRepository.findSessionLastSessionByUserId(
            UserId.create(entry.orderUserId)
        )

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError;

        let data: OrderDeliveringPushNotificationApplicationRequestDTO={
            userId:entry.orderUserId,
            tokens:[tokensResponse.getValue.push_token],
            orderState:entry.orderState,
            orderId:entry.orderId
        }
        service.execute(data);
    }


    async sendPushOrderDelivered(entry:IDeliveredOrder){
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new OrderDeliveredPushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        )
        
        const tokensResponse=await this.querySessionRepository.findSessionLastSessionByUserId(
            UserId.create(entry.orderUserId)
        )

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError

        let data: OrderDeliveredPushNotificationApplicationRequestDTO={
            userId:entry.orderUserId,
            tokens:[tokensResponse.getValue.push_token],
            orderState:entry.orderState,
            orderId:entry.orderId
        }
        service.execute(data);
    }

    async sendPushOrderCancelled(entry:ICancelOrder){
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new CancelledOrderPushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        );

        const tokensResponse=await this.querySessionRepository.findSessionLastSessionByUserId(
            UserId.create(entry.orderUserId)
        )

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError;

        let data: CancelOrderPushNotificationApplicationRequestDTO={
            userId:entry.orderUserId,
            tokens:[tokensResponse.getValue.push_token],
            orderState:entry.orderState,
            orderId:entry.orderId
        };
        service.execute(data);
    };


    async sendEmailOrderCancelled(entry:ICancelOrder){

        const accountResponse=await this.queryAccountRepository.findAccountByUserId(entry.orderUserId);

        if (!accountResponse.isSuccess())
            throw accountResponse.getError;


        let emailsender=new SendGridCancelledOrderEmailSender();
        emailsender.setVariablesToSend({
            username:'customer',
            orderid: entry.orderId
        })
        await emailsender.sendEmail(accountResponse.getValue.email);
    }

    async sendPushOrderCreated(entry:ICreateOrder){
        
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new NewOrderPushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        );

        const tokensResponse=await this.querySessionRepository.findSessionLastSessionByUserId(
            UserId.create(entry.orderUserId)
        )

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError;
        
        let data:NewOrderPushNotificationApplicationRequestDTO={
            userId:entry.orderUserId,
            tokens:[tokensResponse.getValue.push_token],
            orderState:entry.orderState,
            orderCreateDate:entry.orderCreateDate,
            totalAmount:entry.totalAmount.amount,
            currency:entry.totalAmount.currency
        }
        service.execute(data);
    }

    async sendEmailOrderCreated(entry:ICreateOrder){

        const accountResponse=await this.queryAccountRepository.findAccountByUserId(entry.orderUserId);

        if (!accountResponse.isSuccess())
            throw accountResponse.getError;

        let emailsender=new SendGridNewOrderEmailSender()
        emailsender.setVariablesToSend({
            price:entry.totalAmount.amount,
            currency:entry.totalAmount.currency
        })
        await emailsender.sendEmail(accountResponse.getValue.email)     
    };

    async sendPushToCreatedProduct(entry:ICreateProduct):Promise<void> {

        const tokens=await this.querySessionRepository.findAllLastTokenSessions();

        if (!tokens.isSuccess())
            throw tokens.getError;
        
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new NewProductsPushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        );

        let data:NewProductPushNotificationApplicationRequestDTO={
            userId:'none',
            tokens:tokens.getValue,
            productId:entry.productId,
            name:entry.productName,
            price:entry.productPrice.price,
            currency:entry.productPrice.currency
        };
        service.execute(data);
    };

    async sendEmailToCreateProduct(entry:ICreateProduct):Promise<void> {

        const emailsResponse=await this.queryAccountRepository.findAllEmails();

        if (!emailsResponse.isSuccess())
            throw emailsResponse.getError;

        let emailsender=new SendGridNewProductEmailSender();
        emailsender.setVariablesToSend({
            name:entry.productName,
            price:entry.productPrice.price,
            currency:entry.productPrice.currency,
            image:entry.productImage.pop()
        });
        for (const email of emailsResponse.getValue){
            await emailsender.sendEmail(email)
        };      
    };

    async sendEmailToCreateBundle(entry:ICreateBundle):Promise<void> {

        const emailsResponse=await this.queryAccountRepository.findAllEmails();

        if (!emailsResponse.isSuccess())
            throw emailsResponse.getError;
        
        let emailsender=new SendGridNewBundleEmailSender();
        emailsender.setVariablesToSend({
            name:entry.bundleName,
            price:entry.bundlePrice.price,
            currency:entry.bundlePrice.currency,
            image:entry.bundleImages.pop()
        });
        for (const email of emailsResponse.getValue){
            await emailsender.sendEmail(email)
        };        
    }

    async sendPushToCreatedBundle(entry:ICreateBundle){

        const tokensResponse=await this.querySessionRepository.findAllLastTokenSessions();

        if (!tokensResponse.isSuccess())
            throw tokensResponse.getError;

        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new NewBundlePushNotificationApplicationService(
                    this.pushsender
                ),
            new NestLogger(new Logger())
            )
        );

        let data:NewBundlePushNotificationApplicationRequestDTO={
            userId:'none',
            tokens:tokensResponse.getValue,
            name:entry.bundleName,
            price:entry.bundlePrice.price,
            currency:entry.bundlePrice.currency
        };
        service.execute(data);
    };

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('savetoken')
    async saveToken(
        @GetCredential() credential:ICredential,
        @Body() entry:SaveTokenInfraestructureEntryDTO
    ){
        let service=
        new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new UpdateTokenPushNotificationApplicationService(
                            this.commandTokenSessionRepository
                        ),new NestTimer(),new NestLogger(new Logger())
                    ),new NestLogger(new Logger()
                    )
                ),this.auditRepository,new DateHandler()
            )
        )
        let response=await service.execute({
            userId:credential.account.idUser,
            ...entry,session:credential.session
        })
        return response.getValue
    };
}