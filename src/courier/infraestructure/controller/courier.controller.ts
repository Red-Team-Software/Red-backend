import { Body, Controller, FileTypeValidator, Inject, Logger, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { Channel } from "amqplib"
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract"
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { ICourierRepository } from "src/courier/domain/repositories/courier-repository-interface"
import { CreateCourierEntryDTO } from "../dto/create-courier-entry.dto"
import { CourierRepository } from "../repository/orm-repository/orm-courier-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { Courier } from "src/courier/domain/aggregate/courier"
import { OrmCourierEntity } from "../entities/orm-courier-entity"
import { OrmCourierMapper } from "../mapper/orm-courier-mapper/orm-courier-mapper"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { CreateCourierApplicationService } from "src/courier/application/services/create-courier-application.service"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { ICredential } from "src/auth/application/model/credential.interface"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { ICourierQueryRepository } from "src/courier/application/query-repository/courier-query-repository-interface"
import { CourierQueryRepository } from "../repository/orm-repository/orm-courier-query-repository"
import { ModifyCourierLocationEntryDto } from "../dto/modify-order-courier-location-entry.dto"
import { ModifyCourierLocationRequestDto } from "src/courier/application/dto/request/modify-courier-location-request.dto"
import { ModifyCourierLocationApplicationService } from "src/courier/application/services/modify-courier-location-application.service"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Courier')
@Controller('courier')
export class CourierController {

        private readonly courierRepository:ICourierRepository;
        private readonly courierQueryRepository: ICourierQueryRepository;
        private readonly idGen:IIdGen<string>;

        private readonly ormMapper: IMapper<Courier,OrmCourierEntity>;

    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        this.idGen= new UuidGen();
        this.ormMapper = new OrmCourierMapper(this.idGen);
        this.courierRepository= new CourierRepository( PgDatabaseSingleton.getInstance(),this.ormMapper );
        this.courierQueryRepository= new CourierQueryRepository( PgDatabaseSingleton.getInstance(),this.ormMapper );
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))  
    async createCourier(@Body() entry: CreateCourierEntryDTO,
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
            new LoggerDecorator(
                new CreateCourierApplicationService(
                    new RabbitMQPublisher(this.channel),
                    this.courierRepository,
                    this.idGen,
                    new CloudinaryService()
                ),
                new NestLogger(new Logger())
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
            new LoggerDecorator(
                new ModifyCourierLocationApplicationService(
                    this.courierRepository,
                    this.courierQueryRepository,
                    new RabbitMQPublisher(this.channel)
                ),
                new NestLogger(new Logger())
            )
        );
            
        let response = await modifyCourierLocation.execute(request);
            
        return response.getValue;
    }

    

}