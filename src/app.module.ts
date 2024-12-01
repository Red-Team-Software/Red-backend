import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './config/rabbitmq/rabbitmq.module';
import { ProductController } from './product/infraestructure/controller/product.controller';
import { CloudinaryProvider } from './common/infraestructure/providers/cloudinary.provider';
import { NotificationModule } from './notification/infraestructure/notification.module';
import { CategoryController } from './category/infraestructure/controller/category.controller';
import { OrderController } from './order/infraestructure/controller/order.controller';
import { BundleController } from './bundle/infraestructure/controller/bundle.controller';
import { CourierController } from './courier/infraestructure/controller/courier.controller';
import { AuthController } from './auth/infraestructure/controller/auth.controller';
import { UserController } from './user/infraestructure/controller/user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitMQModule,
    NotificationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [
    ProductController,
    CategoryController,
    BundleController,
    OrderController,
    AuthController,
    UserController,
    CourierController
  ],
  providers:[CloudinaryProvider]
})
export class AppModule {}
