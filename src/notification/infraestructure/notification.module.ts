import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controller/notification.controller';
import { RabbitMQModule } from 'src/config/rabbitmq/rabbitmq.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
    }),
    RabbitMQModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [NotificationController]
})
export class NotificationModule {}
