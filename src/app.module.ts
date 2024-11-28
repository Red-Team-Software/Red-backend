import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './config/rabbitmq/rabbitmq.module';
import { ProductController } from './product/infraestructure/controller/product.controller';
import { CloudinaryProvider } from './common/infraestructure/providers/cloudinary.provider';
import { NotificationModule } from './notification/infraestructure/notification.module';
import { CategoryController } from './category/infraestructure/controller/category.controller';
import { OrderController } from './order/infraestructure/controller/order.controller';
import { BundleController } from './bundle/infraestructure/controller/bundle.controller';
import { CuponController } from './cupon/infraestructure/controller/cupon.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule,
    NotificationModule
  ],
  controllers: [
    ProductController,
    CategoryController,
    BundleController,
    OrderController,
    CuponController
  ],
  providers:[CloudinaryProvider]
})
export class AppModule {}
