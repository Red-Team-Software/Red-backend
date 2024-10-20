import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { rabbitMQProvider } from "src/common/infraestructure/providers/rabbitmq.provider";

@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "RABBITMQ_SERVICE",
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<string>("RABBITMQ_URL")],
						queue: configService.get<string>("RABBITMQ_QUEUE"),
						queueOptions: {
							durable: configService.get<boolean>(
								"RABBITMQ_QUEUE_DURABLE",
								true
							),
						},
					},
				}),
			},
		]),
	],
	providers: [rabbitMQProvider],
	exports: [rabbitMQProvider],
})
export class RabbitMQModule {}
