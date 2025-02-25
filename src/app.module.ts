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
import { PaymentMethodController } from './payment-methods/infraestructure/controller/payment-method.controller';
import { CuponController } from './cupon/infraestructure/controller/cupon.controller';
import { PromotionController } from './promotion/infraestructure/controller/promotion.controller';
import { MongoDatabaseSingleton } from './common/infraestructure/database/mongo-database.singleton';
import { PaymentWalletController } from './user/infraestructure/controller/wallet.controller';

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
    CourierController,
    PaymentMethodController,
    CuponController,
    PromotionController,
    PaymentWalletController
  ],
  providers:[
    CloudinaryProvider,
    {
      provide: 'MONGO_CONNECTION',
      useFactory: async () => {
        return await MongoDatabaseSingleton.getInstance();
      },
    }
  ]
})
export class AppModule {}
