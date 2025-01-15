import { Body, Controller, FileTypeValidator, Inject, Logger, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { Channel } from "amqplib"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { ICourierRepository } from "src/courier/application/repository/repositories-command/courier-repository-interface"
import { RegisterCourierEntryDTO } from "../dto/register-courier-entry.dto"
import { CourierRepository } from "../repository/orm-repository/orm-courier-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { Courier } from "src/courier/domain/aggregate/courier"
import { OrmCourierMapper } from "../mapper/orm-courier-mapper/orm-courier-mapper"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { RegisterCourierApplicationService } from "src/courier/application/services/register-courier-application.service"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { ICredential } from "src/auth/application/model/credential.interface"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { ICourierQueryRepository } from "src/courier/application/repository/query-repository/courier-query-repository-interface"
import { CourierQueryRepository } from "../repository/orm-repository/orm-courier-query-repository"
import { ModifyCourierLocationEntryDto } from "../dto/modify-order-courier-location-entry.dto"
import { ModifyCourierLocationRequestDto } from "src/courier/application/dto/request/modify-courier-location-request.dto"
import { ModifyCourierLocationApplicationService } from "src/courier/application/services/modify-courier-location-application.service"
import { NestTimer } from "src/common/infraestructure/timer/nets-timer"
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator"
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator"
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository"
import { RabbitMQSubscriber } from "src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber"
import { CourierQueues } from "../queues/courier-queues"
import { ICourierRegistered } from "src/courier/infraestructure/interface/courier-registered.interface"
import { ICourierDirectionUpdated } from "src/courier/infraestructure/interface/courier-direction-updated.interface"
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface"
import { JwtCourierGenerator } from "../jwt/jwt-courier-generator"
import { JwtService } from "@nestjs/jwt"
import { BcryptEncryptor } from "src/common/infraestructure/encryptor/bcrypt-encryptor"
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface"
import { LogInCourierInfraestructureRequestDTO } from "../dto/log-in-courier-infraestructure-request-dto"
import { LogInCourierApplicationService } from "src/courier/application/services/log-in-courier-application.service"
import { OrmCourierEntity } from "../entities/orm-entities/orm-courier-entity"
import { CourierRegisteredSyncroniceService } from "../service/syncronice/courier-registered-syncronice.service"
import { Mongoose } from "mongoose"
import { CourierUpdatedSyncroniceService } from "../service/syncronice/courier-updated-syncronice.service"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Courier')
@Controller('courier')
export class CourierController {

        private readonly courierRepository:ICourierRepository;
        private readonly courierQueryRepository: ICourierQueryRepository;
        private readonly idGen:IIdGen<string>;
        private readonly auditRepository: IAuditRepository;
        private readonly subscriber: RabbitMQSubscriber;
        private readonly ormMapper: IMapper<Courier,OrmCourierEntity>;
        private readonly jwtGen:IJwtGenerator<string>;
        private readonly encryptor: IEncryptor;
        
        private initializeQueues():void{        
            CourierQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel,
        @Inject("MONGO_CONNECTION") private readonly mongoose: Mongoose,
        private jwtCourierService: JwtService
    ) {
        this.idGen= new UuidGen();
        this.ormMapper = new OrmCourierMapper(this.idGen);
        this.courierRepository= new CourierRepository( PgDatabaseSingleton.getInstance(),this.ormMapper );
        this.courierQueryRepository= new CourierQueryRepository( PgDatabaseSingleton.getInstance());
        this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance());
        this.subscriber= new RabbitMQSubscriber(this.channel);
        this.jwtGen= new JwtCourierGenerator(jwtCourierService)
        this.encryptor= new BcryptEncryptor()

        this.initializeQueues();

        this.subscriber.consume<ICourierRegistered>(
            { name: 'CourierSync/CourierRegistered'}, 
            (data):Promise<void>=>{
                //this.syncCourierRegistered(data)
                    return
            }
        )
        
        this.subscriber.consume<ICourierDirectionUpdated>(
            { name: 'CourierSync/CourierDirectionUpdated'}, 
            (data):Promise<void>=>{
                this.syncCourierUpdated(data)
                return
            }
        )

    }

    async syncCourierRegistered(data:ICourierRegistered){
        let service= new CourierRegisteredSyncroniceService(
            this.mongoose,
            this.courierQueryRepository
        )
        await service.execute(data)
    }

    async syncCourierUpdated(data:ICourierDirectionUpdated){
        let service= new CourierUpdatedSyncroniceService(this.mongoose)
        await service.execute({...data})
    }

    @Post('register')
    @UseInterceptors(FileInterceptor('image'))  
    async createCourier(@Body() entry: RegisterCourierEntryDTO,
    @UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({
                fileType:/(jpeg|.jpg|.png)$/
                }),
            ]
        }),
    ) image: Express.Multer.File) {

        let service= new ExceptionDecorator(
            new AuditDecorator(
                new RegisterCourierApplicationService(
                    new RabbitMQPublisher(this.channel),
                    this.courierRepository,
                    this.idGen,
                    new CloudinaryService(),
                    this.jwtGen,
                    this.encryptor
                ),this.auditRepository,new DateHandler()
            )
        );

        let response= await service.execute({userId:'none',...entry,image:image.buffer});

        return response.getValue;
    }

    @Post('/update-location')
    async modifingCourierLocation(
        @GetCredential() credential:ICredential,
        @Body() data: ModifyCourierLocationEntryDto
    ) {
        let request: ModifyCourierLocationRequestDto = {
            userId: credential.account.idUser,
            courierId: data.courierId,
            lat: data.lat,
            long: data.long
        }
        let modifyCourierLocation = new ExceptionDecorator(
            new PerformanceDecorator(
                new ModifyCourierLocationApplicationService(
                    this.courierRepository,
                    this.courierQueryRepository,
                    new RabbitMQPublisher(this.channel)
                ),
                new NestTimer(),new NestLogger(new Logger())
            )
        );
            
        let response = await modifyCourierLocation.execute(request);
            
        return response.getValue;
    }

    @Post('login') 
    async loginCourier(@Body() entry: LogInCourierInfraestructureRequestDTO) {

        let service= new ExceptionDecorator(
            new AuditDecorator(
                new LogInCourierApplicationService(
                    this.courierQueryRepository,
                    this.encryptor,
                    this.jwtGen,
                ),this.auditRepository,new DateHandler()
            )
        );

        let response= await service.execute({userId:'none',...entry});

        return response.getValue;
    }

}