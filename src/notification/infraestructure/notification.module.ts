import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controller/notification.controller';
import { RabbitMQModule } from 'src/config/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule
  ],
  controllers: [NotificationController]
})
export class NotificationModule {}
