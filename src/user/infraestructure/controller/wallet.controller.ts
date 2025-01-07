import { Body, Controller, Get, Inject, Logger, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Channel } from "amqplib"
import { IAccount } from "src/auth/application/model/account.interface"
import { ICommandAccountRepository } from "src/auth/application/repository/command-account-repository.interface"
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
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
import { AddBalanceToWalletPagoMovilApplicationService } from "src/user/application/services/command/wallet/add-balance-to-wallet-pago-movil-application.service"
import { ConvertCurrencyExchangeRate } from "src/order/infraestructure/domain-service/conversion-currency-exchange-rate"
import { ExchangeRateSingelton } from "src/common/infraestructure/exchange-rate/exchange-rate-singleton"
import { UpdateWalletBalancePagoMovilInfraestructureRequestDTO } from "../dto/request/wallet/update-wallet-balance-pago-movil-infraestructure-request-dto"
import { AddBalancePagoMovilApplicationRequestDTO } from "src/user/application/dto/request/wallet/add-balance-to-wallet-pago-movil-application-resquest-dto"
import { AddBalanceToWalletZelleApplicationService } from "src/user/application/services/command/wallet/add-balance-to-wallet-zelle-application.service"
import { AddBalanceZelleApplicationRequestDTO } from "src/user/application/dto/request/wallet/add-balance-to-wallet-zelle-application-resquest-dto"
import { UpdateWalletBalanceZelleInfraestructureRequestDTO } from "../dto/request/wallet/update-wallet-balance-zelle-infraestructure-request-dto"
import { SaveCardApplicationRequestDTO } from "src/user/application/dto/request/wallet/save-card-application-request-dto"
import { SaveCardInfraestructureRequestDTO } from "../dto/request/wallet/save-card-infraestructure-request-dto"
import { SaveCardToUserApplicationService } from "src/user/application/services/command/wallet/save-card-to-user-application.service"
import { IUserExternalAccountService } from "src/auth/application/interfaces/user-external-account-interface"
import { UserStripeAccount } from "src/auth/infraestructure/services/user-stripe-account"
import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton"
import { GetWalletAmountApplicationService } from "src/user/application/services/query/wallet/get-wallet-amount-application.service"
import { WalletAmountApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-wallet-amount-application-request-dto"
import { GetUserCardsApplicationService } from "src/user/application/services/query/wallet/get-user-cards-application.service"
import { UserCardsApplicationRequestDTO } from "src/user/application/dto/request/wallet/get-user-cards-application-request-dto"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Wallet')
@Controller('pay')
export class PaymentWalletController {

    private readonly ormUserQueryRepo:IQueryUserRepository;
    private readonly ormUserCommandRepo:ICommandUserRepository;
    private readonly ormAccountQueryRepo:IQueryAccountRepository<IAccount>;
    private readonly auditRepository: IAuditRepository;
    private readonly userExternalSite: IUserExternalAccountService;

    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        this.ormUserQueryRepo=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
        this.ormUserCommandRepo=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())
        this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
        this.ormAccountQueryRepo= new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance())
        this.userExternalSite = new UserStripeAccount(StripeSingelton.getInstance())
    }


    @Post('pago-movil')
    async CreatePaymentPagoMovil(
        @GetCredential() credential:ICredential, 
        @Body() entry: UpdateWalletBalancePagoMovilInfraestructureRequestDTO
    ){
        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new AddBalanceToWalletPagoMovilApplicationService (
                            this.ormUserCommandRepo,
                            this.ormUserQueryRepo,
                            new RabbitMQPublisher(this.channel),
                            new ConvertCurrencyExchangeRate(ExchangeRateSingelton.getInstance())
                        ), new NestTimer(), new NestLogger(new Logger())
                    ), new NestLogger(new Logger())
                ),this.auditRepository, new DateHandler()
            )
        );

        let data: AddBalancePagoMovilApplicationRequestDTO = {
            userId: credential.account.idUser,
            phone: entry.phone,
            cedula: entry.cedula,
            bank: entry.bank,
            amount: entry.amount,
            reference: entry.reference,
            date: new Date()
        }

        return await service.execute(data);

    }

    @Post('zelle')
    async CreatePaymentZelle(
        @GetCredential() credential:ICredential, 
        @Body() entry: UpdateWalletBalanceZelleInfraestructureRequestDTO
    ){
        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new AddBalanceToWalletZelleApplicationService (
                            this.ormUserCommandRepo,
                            this.ormUserQueryRepo,
                            new RabbitMQPublisher(this.channel)
                        ), new NestTimer(), new NestLogger(new Logger())
                    ), new NestLogger(new Logger())
                ),this.auditRepository, new DateHandler()
            )
        );

        let data: AddBalanceZelleApplicationRequestDTO = {
            userId: credential.account.idUser,
            phone: entry.phone,
            cedula: entry.cedula,
            bank: entry.bank,
            amount: entry.amount,
            reference: entry.reference,
            date: new Date()
        }

        return await service.execute(data);

    }

    @Post('card')
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
            cardId: entry.id
        }

        return await service.execute(data);

    }

    @Get('wallet-amount')
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

        return await service.execute(data);

    }

    @Get('card')
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

        return await service.execute(data);

    }
}