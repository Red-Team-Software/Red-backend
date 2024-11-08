import { Body, Controller, FileTypeValidator, Inject, ParseFilePipe, Post, UploadedFiles, UseInterceptors } from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express/multer"
import { IBundleRepository } from "src/bundle/domain/repository/product.interface.repositry"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { CreateBundleInfraestructureRequestDTO } from "../dto-request/create-bundle-infraestructure-request-dto"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { RabbitMQEventPublisher } from "src/common/infraestructure/events/publishers/rabbittMq.publisher"
import { Channel } from "amqplib"
import { CreateBundleApplicationService } from "src/bundle/application/services/command/create-bundle-application.service"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"

@Controller('bundle')
export class BundleController {

  private readonly ormBundletRepo:IBundleRepository
  private readonly idGen: IIdGen<string> 
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
  }

  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))  
  async createProduct(@Body() entry: CreateBundleInfraestructureRequestDTO,
  @UploadedFiles(
    new ParseFilePipe({
      validators: [new FileTypeValidator({
        fileType:/(jpeg|.jpg|.png)$/
      }),
      ]
    }),
  ) images: Express.Multer.File[]) {

    let service= new ExceptionDecorator(
          new CreateBundleApplicationService(
            new RabbitMQEventPublisher(this.channel),
            this.ormBundletRepo,
            this.idGen,
            new CloudinaryService()
          ),
      )
      let buffers=images.map(image=>image.buffer)
    let response= await service.execute({userId:'none',...entry,images:buffers})
    return response.getValue
  }

//   @Get('all')
//   async getAllProducts(@Query() entry:FindAllProductsInfraestructureRequestDTO){

//     if(!entry.page)
//       entry.page=1
//     if(!entry.perPage)
//       entry.perPage=10

//     const pagination:PaginationRequestDTO={userId:'none',page:entry.page, perPage:entry.perPage}

//     let service= new ExceptionDecorator(
//         new LoggerDecorator(
//           new FindAllProductsApplicationService(
//             this.ormProductQueryRepo
//           ),
//           new NestLogger(new Logger())
//         )
//       )
//     let response= await service.execute({...pagination})
//     return response.getValue
//   }
}
