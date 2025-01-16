import { IMessagesPublisher } from './../../../application/messages/messages-publisher/messages-publisher.interface';
import { Inject } from "@nestjs/common";
import { Channel } from "amqplib";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { AMQPExchange } from "../../events/model/rabbitmq/amqp-exchange";
import { Message } from 'src/common/application/events/message/message';

export class RabbitMQMessagePublisher implements IMessagesPublisher {
	private readonly exchangeName = "Messages"; // Nombre del exchange

	constructor(
		@Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
	) {
		let exchange:AMQPExchange={
			name:this.exchangeName,
			type:'direct',
			options:{
				durable:false,
			}
		}
		this.initializeExchange(exchange);
	}

	private async initializeExchange(exchange:AMQPExchange) {
		// Cambiamos de 'fanout' a 'direct' para enrutar por clave
		await this.channel.assertExchange(exchange.name, exchange.type,{
			durable:exchange.options.durable
		});
	}

	async publish(events: Message[]): Promise<void> {
		for (const event of events) {
			const routingKey = event.constructor.name // Usamos el nombre del evento como routing key
			this.channel.publish(
				this.exchangeName,
				routingKey, // Utiliza el nombre del evento como routingKey  (Por ahora es vacio que me funciono)
				Buffer.from(event.serialize())
			);
			console.log(event.serialize())
		}
	}
	get ExchangeName():string{ return this.exchangeName}
}
