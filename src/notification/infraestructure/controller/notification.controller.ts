import { Controller, Inject } from "@nestjs/common";
import { Channel } from "amqp-connection-manager";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { RabbitMQEventPublisher } from "src/common/infraestructure/events/publishers/rabbittMq.publisher";

@Controller('notification')
export class NotificationController {

    private readonly publisher:IEventPublisher
    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ){
        this.publisher=new RabbitMQEventPublisher(this.channel)
    }

}