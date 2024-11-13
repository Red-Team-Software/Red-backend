import { Body, Controller, Inject, Post } from "@nestjs/common";
import { Channel } from "amqp-connection-manager";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { RabbitMQSubscriber } from "src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber";
import { ICreateProduct } from "../interfaces/create-product.interface";
import { SaveTokenInfraestructureEntryDTO } from "../dto-request/save-token-infraestructure-entry-dto";

@Controller('notification')
export class NotificationController {

    private readonly subscriber:RabbitMQSubscriber
    private readonly tokens:string[]=[]
    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ){
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
        this.subscriber.consume<ICreateProduct>(
            { name: 'ProductEvents'}, 
            (data)=>this.sendEmailToCreateProduct(data)
        )
    }

    async sendPushToCreatedProduct(data:ICreateProduct):Promise<void> {
        
        //TODO
    }

    async sendEmailToCreateProduct(data:ICreateProduct):Promise<void> {
        console.log('llego')
    }

    @Post('savetoken')
    async saveToken(@Body() entry:SaveTokenInfraestructureEntryDTO){
        this.tokens.push(entry.token)
    }
}