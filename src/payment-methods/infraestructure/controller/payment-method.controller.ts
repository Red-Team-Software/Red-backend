import { Body, Controller, FileTypeValidator, Inject, Logger, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodEntity } from "../entity/orm-entity/orm-payment-method-entity";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { Channel } from "amqplib";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";
import { IPaymentMethodRepository } from "src/payment-methods/domain/repository/payment-method-repository.interface";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { OrmPaymentMethodMapper } from "../mapper/orm-mapper/orm-payment-method-mapper";
import { OrmPaymentMethodQueryRepository } from "../repository/orm-repository/orm-payment-method-query-repository";
import { OrmPaymentMethodRepository } from "../repository/orm-repository/orm-payment-method-repository";
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator";
import { ICredential } from "src/auth/application/model/credential.interface";
import { CreatePaymentMethodInfraestructureRequestDTO } from "../dto/create-payment-method-entry.dto";
import { CreatePaymentMethodRequestDto } from "src/payment-methods/application/dto/request/create-payment-method-request-dto";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { CreatePaymentMethodApplicationService } from "src/payment-methods/application/service/create-payment-method.application.service";
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader";
import { FileInterceptor } from "@nestjs/platform-express";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Payment Method')
@Controller('payment-method')
export class PaymentMethodController {

    //*Mappers
    private readonly paymentMethodMapper: IMapper<PaymentMethodAgregate,PaymentMethodEntity>;

    //*Repositories
    private readonly paymentMethodRepository: IPaymentMethodRepository;
    private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository;

    //*IdGen
    private readonly idGen: IIdGen<string>;

    //*RabbitMQ
    private readonly rabbitMq: IEventPublisher;


    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        //*IdGen
        this.idGen = new UuidGen();

        //*RabbitMQ
        this.rabbitMq = new RabbitMQPublisher(this.channel);

        //*Mappers
        this.paymentMethodMapper = new OrmPaymentMethodMapper();

        //*Repositories
        this.paymentMethodRepository = new OrmPaymentMethodRepository(PgDatabaseSingleton.getInstance(),this.paymentMethodMapper);
        this.paymentMethodQueryRepository = new OrmPaymentMethodQueryRepository(PgDatabaseSingleton.getInstance(),this.paymentMethodMapper);
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image')) 
    async createPaymentMethod(
        @GetCredential() credential:ICredential,
        @Body() data: CreatePaymentMethodInfraestructureRequestDTO,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                    fileType:/(jpeg|.jpg|.png)$/
                    }),
                ]
            }),
        ) image: Express.Multer.File) {
        let method: CreatePaymentMethodRequestDto = {
            userId: credential.account.idUser,
            name: data.name,
            image: image.buffer
        }

        let payOrderService = new ExceptionDecorator(
            new LoggerDecorator(
                new CreatePaymentMethodApplicationService(
                    this.paymentMethodRepository,
                    this.rabbitMq,
                    this.idGen,
                    new CloudinaryService()
                ),
                new NestLogger(new Logger())
            )
        );


        let response = await payOrderService.execute(method);
        
        return response.getValue;
    }

}