import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { Channel } from "amqp-connection-manager";
import { AddNewProductsApplicationService } from "src/notification/application/services/command/new-product-push-notification-application.service";
import { FirebaseNotifier } from '../firebase-notifier/firebase-notifier-singleton';
import { IPushNotifier } from "src/common/application/notification-handler/notification-interface";
import { NewProductPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/new-product-push-notification-application-request-dto";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { SaveTokenInfraestructureEntryDTO } from "../dto-request/save-token-infraestructure-entry-dto";

@Controller('notification')
export class NotificationController {

    private readonly subscriber:RabbitMQSubscriber
    private readonly tokens:string[]=[]
    private readonly pushsender:IPushNotifier
    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ){
        this.pushsender=FirebaseNotifier.getInstance()
        this.subscriber=new RabbitMQSubscriber(this.channel)

        this.subscriber.buildQueue({
            name:'ProductEvents',
            pattern: 'ProductRegistered',
            exchange:{
                name:'DomainEvent',
                type:'direct',
                options:{
                    durable:false,
                }
            }
        })

        this.subscriber.buildQueue({
            name:'BundleEvents',
            pattern: 'BundleRegistered',
            exchange:{
                name:'DomainEvent',
                type:'direct',
                options:{
                    durable:false,
                }
            }
        })


        this.subscriber.consume<ICreateProduct>(
            { name: 'ProductEvents'}, 
            (data):Promise<void>=>{
                this.sendEmailToCreateProduct(data)
                this.sendPushToCreatedProduct(data)
                return
            }
        )

        this.subscriber.consume<ICreateProduct>(
            { name: 'BundleEvents'}, 
            (data):Promise<void>=>{
                this.sendEmailToCreateProduct(data)
                this.sendPushToCreatedProduct(data)
                return
            }
        )
    }

    async sendPushToCreatedProduct(entry:ICreateProduct):Promise<void> {
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new AddNewProductsApplicationService(
                    this.pushsender
                ),
              new NestLogger(new Logger())
            )
          )

        let data:NewProductPushNotificationApplicationRequestDTO={
            userId:'none',
            tokens:this.tokens,
            name:entry.productName,
            price:entry.productPrice.price,
            currency:entry.productPrice.currency
        }
        service.execute(data)
    }

    async sendPushToCreatedBundle(){
        

    }

    async sendEmailToCreateProduct(entry:ICreateProduct):Promise<void> {
    }

    @Post('savetoken')
    async saveToken(@Body() entry:SaveTokenInfraestructureEntryDTO){
        this.tokens.push(entry.token)
        return {success:true}
    }
}