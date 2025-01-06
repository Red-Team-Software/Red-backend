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
import { AddBalancePagoMovilApplicationRequestDTO } from "src/user/application/dto/request/add-balance-to-wallet-pago-movil-application-resquest-dto"
import { AddBalanceToWalletZelleApplicationService } from "src/user/application/services/command/wallet/add-balance-to-wallet-zelle-application.service"
import { AddBalanceZelleApplicationRequestDTO } from "src/user/application/dto/request/add-balance-to-wallet-zelle-application-resquest-dto"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Wallet')
@Controller('pay')
export class PaymentWalletController {

    private readonly idGen: IIdGen<string> ;
    private readonly ormUserQueryRepo:IQueryUserRepository;
    private readonly ormUserCommandRepo:ICommandUserRepository;
    private readonly ormAccountCommandRepo:ICommandAccountRepository<IAccount>;
    private readonly ormAccountQueryRepo:IQueryAccountRepository<IAccount>;
    private readonly auditRepository: IAuditRepository;

    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        this.idGen= new UuidGen()
        this.ormUserQueryRepo=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
        this.ormUserCommandRepo=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())
        this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
        this.ormAccountCommandRepo= new OrmAccountCommandRepository(PgDatabaseSingleton.getInstance())
        this.ormAccountQueryRepo= new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance())

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
            date: entry.date
        }

        return await service.execute(data);

    }

    @Post('zelle')
    async CreatePaymentZelle(
        @GetCredential() credential:ICredential, 
        @Body() entry: UpdateWalletBalancePagoMovilInfraestructureRequestDTO
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
            date: entry.date
        }

        return await service.execute(data);

    }

}