import { Body, Controller, Delete, Get, Inject, Logger, Param, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Channel } from "amqplib"
import { IAccount } from "src/auth/application/model/account.interface"
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { OrmUserQueryRepository } from "../repositories/orm-repository/orm-user-query-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { OrmUserCommandRepository } from "../repositories/orm-repository/orm-user-command-repository"
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository"
import { OrmAccountCommandRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-account-command-repository"
import { OrmAccountQueryRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-account-query-repository"
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { ICredential } from "src/auth/application/model/credential.interface"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { NestTimer } from "src/common/infraestructure/timer/nets-timer"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler"
import { AddBalanceToWalletApplicationService } from "src/user/application/services/command/wallet/add-balance-to-wallet-application.service"
import { ConvertCurrencyExchangeRate } from "src/order/infraestructure/domain-service/conversion-currency-exchange-rate"
import { ExchangeRateSingelton } from "src/common/infraestructure/exchange-rate/exchange-rate-singleton"
import { UpdateWalletBalancePagoMovilInfraestructureRequestDTO } from "../dto/request/wallet/update-wallet-balance-pago-movil-infraestructure-request-dto"
import { AddBalancePagoMovilApplicationRequestDTO } from "src/user/application/dto/request/wallet/add-balance-to-wallet-pago-movil-application-resquest-dto"
import { UpdateWalletBalanceZelleInfraestructureRequestDTO } from "../dto/request/wallet/update-wallet-balance-zelle-infraestructure-request-dto"
import { SaveCardApplicationRequestDTO } from "src/user/application/dto/request/wallet/save-card-application-request-dto"
import { SaveCardInfraestructureRequestDTO } from "../dto/request/wallet/save-card-infraestructure-request-dto"
import { SaveCardToUserApplicationService } from "src/user/application/services/command/wallet/save-card-to-user-application.service"
import { IUserExternalAccount } from "src/auth/application/interfaces/user-external-account-interface"
import { UserStripeAccount } from "src/auth/infraestructure/external-account/user-stripe-account"
import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton"
import { GetWalletAmountApplicationService } from "src/user/application/services/query/wallet/get-wallet-amount-application.service"
import { WalletAmountApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-wallet-amount-application-request-dto"
import { GetUserCardsApplicationService } from "src/user/application/services/query/wallet/get-user-cards-application.service"
import { UserCardsApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-user-cards-application-request-dto"
import { FindAllTransactionsByWalletInfraestructureEntryDto } from "../dto/request/wallet/find-all-transactions-by-wallet-infraestructure-request-dto"
import { GetAllTransactionsApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-all-transactions-application-request-dto"
import { IQueryTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction-query-repository.interface"
import { ITransaction } from "src/user/application/model/transaction-interface"
import { OrmTransactionQueryRepository } from "../repositories/orm-repository/orm-transaction-query-repository"
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface"
import { OrmPaymentMethodQueryRepository } from "src/payment-methods/infraestructure/repository/orm-repository/orm-payment-method-query-repository"
import { OrmPaymentMethodMapper } from "src/payment-methods/infraestructure/mapper/orm-mapper/orm-payment-method-mapper"
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface"
import { OrmTransactionCommandRepository } from "../repositories/orm-repository/orm-transaction-command-repository"
import { FindAllTransactionsByUserApplicationService } from "src/user/application/services/query/wallet/get-all-transactions-application.service"
import { FindTransactionByIdApplicationService } from "src/user/application/services/query/wallet/get-transaction-by-id-application.service"
import { GetTransactionByIdApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-transaction-by-id-application-request-dto"
import { FindTransactionByIdEntryDTO } from "../dto/request/wallet/find-transaction-by-id-entry.dto"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { DeleteCardInfraestructureRequestDTO } from "../dto/request/wallet/delete-card-infraestructure-request-dto"
import { AddBalanceZelleResponseDTO } from "../dto/response/wallet/add-balance-to-wallet-pago-movil-direction-response-dto"
import { DeleteCardToUserApplicationService } from "src/user/application/services/command/wallet/delete-card-to-user-application.service"
import { DeleteCardApplicationRequestDTO } from "src/user/application/dto/request/wallet/delete-card-application-request-dto"
import { CalculateBallanceService } from "src/user/domain/domain-services/services/calculate-ballance.service"
import { ConvertDollars } from "../domain-services/convert-dollars.service"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Wallet')
@Controller('payment/method')
export class PaymentWalletController {

    private readonly idGen: IIdGen<string> 
    private readonly ormUserQueryRepo:IQueryUserRepository;
    private readonly ormUserCommandRepo:ICommandUserRepository;
    private readonly ormAccountQueryRepo:IQueryAccountRepository<IAccount>;
    private readonly auditRepository: IAuditRepository;
    private readonly userExternalSite: IUserExternalAccount;
    private readonly transactionQueryRepository: IQueryTransactionRepository<ITransaction>;
    private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository;
    private TransactionCommandRepository: ICommandTransactionRepository<ITransaction>

    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        this.idGen= new UuidGen();
        this.ormUserQueryRepo=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance());
        this.ormUserCommandRepo=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance());
        this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance());
        this.ormAccountQueryRepo= new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance());
        this.userExternalSite = new UserStripeAccount(StripeSingelton.getInstance());
        this.transactionQueryRepository = new OrmTransactionQueryRepository(PgDatabaseSingleton.getInstance());
        this.paymentMethodQueryRepository = new OrmPaymentMethodQueryRepository(
                    PgDatabaseSingleton.getInstance(),
                    new OrmPaymentMethodMapper()
                );
        this.TransactionCommandRepository = new OrmTransactionCommandRepository(PgDatabaseSingleton.getInstance());
    }

    @Post('recharge/pago-movil')
    @ApiResponse({
        status: 200,
        description: 'Add balance to wallet',
        type: AddBalanceZelleResponseDTO,
    })
    async CreatePaymentPagoMovil(
        @GetCredential() credential:ICredential, 
        @Body() entry: UpdateWalletBalancePagoMovilInfraestructureRequestDTO
    ){
        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new AddBalanceToWalletApplicationService (
                            this.ormUserCommandRepo,
                            this.ormUserQueryRepo,
                            new RabbitMQPublisher(this.channel),
                            new CalculateBallanceService(
                                new ConvertDollars(
                                    new ConvertCurrencyExchangeRate(ExchangeRateSingelton.getInstance())
                                )
                            ),
                            this.TransactionCommandRepository,
                            this.idGen
                        ), new NestTimer(), new NestLogger(new Logger())
                    ), new NestLogger(new Logger())
                ),this.auditRepository, new DateHandler()
            )
        );


        let data: AddBalancePagoMovilApplicationRequestDTO = {
            userId: credential.account.idUser,
            amount: entry.amount,
            currency: 'bsf',
            date: new Date(),
            paymentId: entry.paymentId
        }

        let response = await service.execute(data);

        return response.getValue;

    }

    @Post('recharge/zelle')
    @ApiResponse({
        status: 200,
        description: 'Add balance to wallet',
        type: AddBalanceZelleResponseDTO,
    })
    async CreatePaymentZelle(
        @GetCredential() credential:ICredential, 
        @Body() entry: UpdateWalletBalanceZelleInfraestructureRequestDTO
    ){

        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new AddBalanceToWalletApplicationService (
                            this.ormUserCommandRepo,
                            this.ormUserQueryRepo,
                            new RabbitMQPublisher(this.channel),
                            new CalculateBallanceService(
                                new ConvertDollars(
                                    new ConvertCurrencyExchangeRate(ExchangeRateSingelton.getInstance())
                                )
                            ),
                            this.TransactionCommandRepository,
                            this.idGen
                        ), new NestTimer(), new NestLogger(new Logger())
                    ), new NestLogger(new Logger())
                ),this.auditRepository, new DateHandler()
            )
        );


        let data: AddBalancePagoMovilApplicationRequestDTO = {
            userId: credential.account.idUser,
            amount: entry.amount,
            currency: 'usd',
            date: new Date(),
            paymentId: entry.paymentId
        }

        let response = await service.execute(data);

        return response.getValue;

    }

    @Post('user/add/card')
    @ApiResponse({
        status: 200,
        description: 'Add balance to wallet',
        type: AddBalanceZelleResponseDTO,
    })
    async CreatePaymentStripe(
        @GetCredential() credential:ICredential, 
        @Body() entry: SaveCardInfraestructureRequestDTO
    ){
        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new SaveCardToUserApplicationService (
                            this.ormUserQueryRepo,
                            this.ormAccountQueryRepo,
                            this.userExternalSite
                        ), new NestTimer(), new NestLogger(new Logger())
                    ), new NestLogger(new Logger())
                ),this.auditRepository, new DateHandler()
            )
        );

        let data: SaveCardApplicationRequestDTO = {
            userId: credential.account.idUser,
            cardId: entry.idCard
        }

        let response = await service.execute(data);

        return response.getValue;

    }

    @Delete('user/delete/{id}')
    async DeletePaymentStripe(
        @GetCredential() credential:ICredential, 
        @Param() entry: DeleteCardInfraestructureRequestDTO
    ){
        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new DeleteCardToUserApplicationService (
                            this.ormUserQueryRepo,
                            this.userExternalSite
                        ), new NestTimer(), new NestLogger(new Logger())
                    ), new NestLogger(new Logger())
                ),this.auditRepository, new DateHandler()
            )
        );

        let data: DeleteCardApplicationRequestDTO = {
            userId: credential.account.idUser,
            cardId: entry.id
        }

        let response = await service.execute(data);

        return response.getValue;

    }

    @Get('user/wallet-amount')
    async GetWalletAmount(
        @GetCredential() credential:ICredential
    ){
        let service= new ExceptionDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new GetWalletAmountApplicationService (
                            this.ormUserQueryRepo,
                        ), 
                        new NestTimer(), 
                        new NestLogger(new Logger())
                ), new NestLogger(new Logger())
            )
        );

        let data: WalletAmountApplicationRequestDTO = {
            userId: credential.account.idUser
        }

        let response = await service.execute(data);

        return response.getValue;

    }

    @Get('user/card/many')
    async GetCards(
        @GetCredential() credential:ICredential
    ){
        let service= new ExceptionDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new GetUserCardsApplicationService (
                            this.ormUserQueryRepo,
                            this.ormAccountQueryRepo,
                            this.userExternalSite
                        ), 
                        new NestTimer(), 
                        new NestLogger(new Logger())
                ), new NestLogger(new Logger())
            )
        );

        let data: UserCardsApplicationRequestDTO = {
            userId: credential.account.idUser
        }

        let response = await service.execute(data);

        return response.getValue;

    }

    @Get('transaction/many')
    async findAllTransactionsByUser(
        @GetCredential() credential:ICredential,
        @Query() data: FindAllTransactionsByWalletInfraestructureEntryDto
    ) {
        let values: GetAllTransactionsApplicationRequestDTO = {
            userId: credential.account.idUser,
            page: data.page,
            perPage: data.perPage
        };
    
        if(!data.page)
            values.page=1;
        if(!data.perPage)
            values.perPage=10;
        
        let service=
            new ExceptionDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new FindAllTransactionsByUserApplicationService(
                            this.transactionQueryRepository,
                            this.ormUserQueryRepo,
                            this.paymentMethodQueryRepository
                        ), new NestTimer(), new NestLogger(new Logger())
                    ),new NestLogger(new Logger())
                )
            );
            
        let response = await service.execute(values)
        return response.getValue;
    }

    @Get('transaction/:transactionId')
    async findTransactionById(
        @GetCredential() credential:ICredential,
        @Query() data: FindTransactionByIdEntryDTO
    ) {
        let values: GetTransactionByIdApplicationRequestDTO = {
            userId: credential.account.idUser,
            transactionId: data.transactionId
        };
        
        let service=
            new ExceptionDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new FindTransactionByIdApplicationService(
                            this.transactionQueryRepository,
                            this.paymentMethodQueryRepository
                        ), new NestTimer(), new NestLogger(new Logger())
                    ),new NestLogger(new Logger())
                )
            );
            
        let response = await service.execute(values)
        return response.getValue;
    }
}