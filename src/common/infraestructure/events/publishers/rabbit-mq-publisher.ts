import { Inject } from "@nestjs/common";
import { Channel } from "amqplib";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { AMQPExchange } from "../model/rabbitmq/amqp-exchange";

export class RabbitMQPublisher extends IEventPublisher {
	private readonly exchangeName = "DomainEvent"; // Nombre del exchange

	constructor(
		@Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
	) {
		super();
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

	async publish(events: DomainEvent[]): Promise<void> {
		for (const event of events) {
			const routingKey = event.constructor.name; // Usamos el nombre del evento como routing key
			this.channel.publish(
				this.exchangeName,
				routingKey, // Utiliza el nombre del evento como routingKey  (Por ahora es vacio que me funciono)
				Buffer.from(event.serialize())
			);
		}
	}
	get ExchangeName():string{ return this.exchangeName}
}
