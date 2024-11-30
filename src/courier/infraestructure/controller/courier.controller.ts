import { Body, Controller, FileTypeValidator, Inject, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common"
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


@Controller('courier')
export class CourierController {

        private readonly courierRepository:ICourierRepository;
        private readonly idGen:IIdGen<string>;

        private readonly ormMapper: IMapper<Courier,OrmCourierEntity>;

    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        this.idGen= new UuidGen();
        this.ormMapper = new OrmCourierMapper(this.idGen);
        this.courierRepository= new CourierRepository( PgDatabaseSingleton.getInstance(),this.ormMapper );
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
            new CreateCourierApplicationService(
                new RabbitMQPublisher(this.channel),
                this.courierRepository,
                this.idGen,
                new CloudinaryService()
            ),
        );

        let response= await service.execute({userId:'none',...entry,image:image.buffer});

        return response.getValue;
    }
}