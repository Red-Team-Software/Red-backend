import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './config/rabbitmq/rabbitmq.module';
import { ProductController } from './product/infraestructure/controller/product.controller';
import { CloudinaryProvider } from './common/infraestructure/providers/cloudinary.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule
  ],
  controllers: [ProductController],
  providers:[CloudinaryProvider]
})
export class AppModule {}
