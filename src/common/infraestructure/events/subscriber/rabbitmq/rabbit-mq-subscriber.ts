import { Inject } from "@nestjs/common";
import { Channel } from "amqplib";
import { AMQPExchange } from "../../model/rabbitmq/amqp-exchange";
import { AMQPQueue } from "../../model/rabbitmq/amqp-queue";

export class RabbitMQSubscriber {
	private readonly exchangeName = "DomainEvent"; // Nombre del exchange

	constructor(
		@Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
	) {
		let exchange:AMQPExchange={
			name:this.exchangeName,
			type:'direct',
			options:{
				durable:false
			}
		}
		this.initializeExchange(exchange);
	}

	private async initializeExchange(exchange:AMQPExchange) {
		// Cambiamos de 'fanout' a 'direct' para enrutar por clave
		await this.channel.assertExchange(exchange.name, exchange.type,
		{
			durable: false,
		});
	}

    async buildQueue( queue: AMQPQueue ) {
        this.channel.assertQueue( queue.name, {  exclusive: true} )    
        this.channel.assertExchange(queue.exchange.name, queue.exchange.type,{durable:false})
        this.channel.bindQueue(queue.name, queue.exchange.name, queue.pattern)
    }

    async consume<T>( queue: AMQPQueue, callback: (entry:T) => Promise<void> ) {
        this.channel.consume(queue.name, async (message) => {
            const content = JSON.parse(message.content.toString())
			console.log(content)
            await callback(content) 
            this.channel.ack(message)
        })

    }
	get ExchangeName():string{ return this.exchangeName}
}
