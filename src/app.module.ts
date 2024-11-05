import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './config/rabbitmq/rabbitmq.module';
import { ProductController } from './product/infraestructure/controller/product.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule,
  ],
  controllers: [ProductController],
})
export class AppModule {}
