import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
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
import { ICreateOrder } from "../interfaces/create-order.interface";
import { NewBundlePushNotificationApplicationService } from "src/notification/application/services/command/new-bundle-push-notification-application.service";
import { NewProductsPushNotificationApplicationService } from "src/notification/application/services/command/new-product-push-notification-application.service";
import { SendGridNewOrderEmailSender } from "src/common/infraestructure/email-sender/send-grid-new-order-email-sender.service";
import { NewOrderPushNotificationApplicationService } from "src/notification/application/services/command/new-order-push-notification-application.service";
import { NewOrderPushNotificationApplicationRequestDTO } from "src/notification/application/dto/request/new-order-push-notification-application-request-dto";

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

        this.subscriber.buildQueue({
            name:'OrderEvents',
            pattern: 'OrderRegistered',
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

        this.subscriber.consume<ICreateBundle>(
            { name: 'BundleEvents'}, 
            (data):Promise<void>=>{
                this.sendPushToCreatedBundle(data)
                this.sendEmailToCreateBundle(data)
                return
            }
        )

        this.subscriber.consume<ICreateOrder>(
            { name: 'OrderEvents'}, 
            (data):Promise<void>=>{
                this.sendPushOrderCreated(data)
                this.sendEmailOrderCreated(data)
                return
            }
        )
    }

    async sendPushOrderCreated(entry:ICreateOrder){
        
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new NewOrderPushNotificationApplicationService(
                    this.pushsender
                ),
              new NestLogger(new Logger())
            )
          )
        let data:NewOrderPushNotificationApplicationRequestDTO={
            userId:'none',
            tokens:this.tokens,
            orderState:entry.orderState,
            orderCreateDate:entry.orderCreateDate,
            totalAmount:entry.totalAmount.amount,
            currency:entry.totalAmount.currency
        }
        service.execute(data)
    }

    async sendEmailOrderCreated(entry:ICreateOrder){
        let emailsender=new SendGridNewOrderEmailSender()
        emailsender.setVariablesToSend({
            price:entry.totalAmount.amount,
            currency:entry.totalAmount.currency
        })
        await emailsender.sendEmail('anfung.21@est.ucab.edu.ve')     }

    async sendPushToCreatedProduct(entry:ICreateProduct):Promise<void> {
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new NewProductsPushNotificationApplicationService(
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

    async sendEmailToCreateProduct(entry:ICreateProduct):Promise<void> {
        let emailsender=new SendGridNewProductEmailSender()
        emailsender.setVariablesToSend({
            name:entry.productName,
            price:entry.productPrice.price,
            currency:entry.productPrice.currency,
            image:entry.productImage.pop()
        })
        await emailsender.sendEmail('anfung.21@est.ucab.edu.ve')    }

    async sendEmailToCreateBundle(entry:ICreateBundle):Promise<void> {
        let emailsender=new SendGridNewBundleEmailSender()
        emailsender.setVariablesToSend({
            name:entry.bundleName,
            price:entry.bundlePrice.price,
            currency:entry.bundlePrice.currency,
            image:entry.bundleImages.pop()
        })
        await emailsender.sendEmail('anfung.21@est.ucab.edu.ve')
    }

    async sendPushToCreatedBundle(entry:ICreateBundle){
        let service= new ExceptionDecorator(
            new LoggerDecorator(
                new NewBundlePushNotificationApplicationService(
                    this.pushsender
                ),
              new NestLogger(new Logger())
            )
          )

        let data:NewProductPushNotificationApplicationRequestDTO={
            userId:'none',
            tokens:this.tokens,
            name:entry.bundleName,
            price:entry.bundlePrice.price,
            currency:entry.bundlePrice.currency
        }
        service.execute(data)
    }


    @Post('savetoken')
    async saveToken(@Body() entry:SaveTokenInfraestructureEntryDTO){
        this.tokens.push(entry.token)
        return {success:true}
    }
}