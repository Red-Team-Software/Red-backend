import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";

export const rabbitMQProvider: Provider = {
	provide: "RABBITMQ_CONNECTION",
	useFactory: async (configService: ConfigService) => {
		const url = configService.get<string>("RABBITMQ_URL");
		const connection = await amqp.connect(url);
		return await connection.createChannel();
	},
	inject: [ConfigService],
};
