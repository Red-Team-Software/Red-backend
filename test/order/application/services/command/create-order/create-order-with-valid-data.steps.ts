// import { When, Then } from "@cucumber/cucumber"
// import * as assert from 'assert';
// import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
// import { BundleDescription } from "src/bundle/domain/value-object/bundle-description";
// import { BundleId } from "src/bundle/domain/value-object/bundle-id";
// import { BundleImage } from "src/bundle/domain/value-object/bundle-image";
// import { BundleName } from "src/bundle/domain/value-object/bundle-name";
// import { BundlePrice } from "src/bundle/domain/value-object/bundle-price";
// import { BundleStock } from "src/bundle/domain/value-object/bundle-stock";
// import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth";
// import { PayOrderAplicationService } from "src/order/application/service/pay-order-application.service";
// import { Product } from "src/product/domain/aggregate/product.aggregate";
// import { ProductDescription } from "src/product/domain/value-object/product-description";
// import { ProductID } from "src/product/domain/value-object/product-id";
// import { ProductImage } from "src/product/domain/value-object/product-image";
// import { ProductName } from "src/product/domain/value-object/product-name";
// import { ProductPrice } from "src/product/domain/value-object/product-price";
// import { ProductStock } from "src/product/domain/value-object/product-stock";
// import { ProductWeigth } from "src/product/domain/value-object/product-weigth";
// import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate";
// import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description";
// import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount";
// import { PromotionId } from "src/promotion/domain/value-object/promotion-id";
// import { PromotionName } from "src/promotion/domain/value-object/promotion-name";
// import { PromotionState } from "src/promotion/domain/value-object/promotion-state";
// import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock";
// import { CalculateShippingFeeMock } from "test/order/infraestructure/mock/domain-services/calculate-shipping-fee-mock";
// import { CalculateTaxesFeeMock } from "test/order/infraestructure/mock/domain-services/calculate-tax-fee-mock";
// import { OrderCommandRepositoryMock } from "test/order/infraestructure/mock/repositories/order-command-repository.mock";
// import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
// import { PromotionQueryRepositoryMock } from "test/promotion/infraestructure/mocks/repositories/promotion-query-repository.mock";
// import { PaymentMethodQueryRepositoryMock } from '../../../../../payment-method/infraestructure/moks/repositories/payment-method-query-repository.mock';
// import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
// import { PaymentMethodId } from "src/payment-methods/domain/value-objects/payment-method-id";
// import { PaymentMethodImage } from "src/payment-methods/domain/value-objects/payment-method-image";
// import { PaymentMethodName } from "src/payment-methods/domain/value-objects/payment-method-name";
// import { PaymentMethodState } from "src/payment-methods/domain/value-objects/payment-method-state";
// import { DateHandler } from "src/common/infraestructure/date-handler/date-handler";
// import { GeocodificationDomainServiceMock } from "test/order/infraestructure/mock/domain-services/geocodification-domain-service.mock";
// import { CourierQueryRepositoryMock } from "test/courier/infraestructure/mock/repositories/courier-query-repository.mock";
// import { PayOrderMockMethod } from "test/order/infraestructure/mock/domain-services/pay-order-mock-method";
// import { Courier } from "src/courier/domain/aggregate/courier";
// import { CourierId } from "src/courier/domain/value-objects/courier-id";
// import { CourierName } from "src/courier/domain/value-objects/courier-name";
// import { CourierImage } from "src/courier/domain/value-objects/courier-image";
// import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
// import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";

// let caughtError:any;

// When('Trying to create a order with valid data', async () => {

    
// const promotions: Promotion[] = [
//     Promotion.initializeAggregate(
//         PromotionId.create('e09771db-2657-45fb-ad39-ae6604422414'),
//         PromotionDescription.create('Descripcion de prueba'),
//         PromotionName.create('promocion navidad 2024'),
//         PromotionState.create('avaleable'),
//         PromotionDiscount.create(0.20),
//         [
//             ProductID.create('e09771db-2657-45fb-ad39-ae6604422919')
//         ],
//         [
//             BundleId.create('e09771db-2657-45fb-ad39-ae6604422818')
//         ],
//         []
//     )
// ];

// const bundles: Bundle[] = [
//         Bundle.initializeAggregate(
//         BundleId.create('e09771db-2657-45fb-ad39-ae6604422818'),
//         BundleDescription.create('descripcion'),
//         BundleName.create('arroz chino con lumpias'),
//         BundleStock.create(50),
//         [
//             BundleImage.create('http://image.jpg')
//         ],
//             BundlePrice.create(50,'usd'),
//             BundleWeigth.create(50,'kg'),
//         [
//             ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
//             ProductID.create('5c84a611-a1dd-4944-a60d-baad170c4593')
//         ]
//     )
// ];

// const products: Product[] = [
//     Product.initializeAggregate(
//         ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
//         ProductDescription.create('descripcion de comida china'),
//         ProductName.create('comida china'),
//         ProductStock.create(10),
//         [
//             ProductImage.create('http://prueba.jpg')
//         ],
//         ProductPrice.create(10,'usd'),
//         ProductWeigth.create(10,'kg')
//     ),
//     Product.initializeAggregate(
//         ProductID.create("5c84a611-a1dd-4944-a60d-baad170c4593"),
//         ProductDescription.create('descripcion de comida japonesa'),
//         ProductName.create('comida japonesa'),
//         ProductStock.create(10),
//         [ProductImage.create('http://image-123.jpg')],
//         ProductPrice.create(10,'usd'),
//         ProductWeigth.create(10,'kg')
//     )
// ];

// const paymentMethods: PaymentMethodAgregate[] = [
//     PaymentMethodAgregate.initializeAgregate(
//         PaymentMethodId.create("5c84a611-a1dd-4944-a60d-baad170c1000"),
//         PaymentMethodName.create('Paypal'),
//         PaymentMethodState.create('active'),
//         PaymentMethodImage.create('http://image.jpg')
//     ),
//     PaymentMethodAgregate.initializeAgregate(
//         PaymentMethodId.create("4ba7289d-9c8c-411a-8c88-8f596e5821fa"),
//         PaymentMethodName.create('Stripe'),
//         PaymentMethodState.create('active'),
//         PaymentMethodImage.create('http://image.jpg')
//     )
// ];

// const couriers: Courier[] = [
//     Courier.initializeAggregate(
//         CourierId.create("84a5dcce-2b53-49f7-8ab2-079c2d42df0f"),
//         CourierName.create('Juan Perez'),
//         CourierImage.create('http://image-123.jpg')
//     )
// ];

//     let service = new PayOrderAplicationService(
//         new EventPublisherMock(),
//         new CalculateShippingFeeMock(),
//         new CalculateTaxesFeeMock(),
//         new PayOrderMockMethod(),
//         new OrderCommandRepositoryMock(),
//         new IdGeneratorMock(),
//         new GeocodificationDomainServiceMock(),
//         new ProductQueryRepositoryMock(products),
//         new BundleQueryRepositoryMock(bundles),
//         new CourierQueryRepositoryMock(couriers),
//         new DateHandler(),
//         new PromotionQueryRepositoryMock(promotions),
//         new PaymentMethodQueryRepositoryMock(paymentMethods)
//     );

//     try {
//         let response= await service.execute({
//             userId: 'e09771db-2657-45fb-ad39-ae6604422919',
//             paymentId: "5c84a611-a1dd-4944-a60d-baad170c1000",
//             currency: "usd",
//             paymentMethod: "card",
//             address: "Avenida Principal Alto Prado, Edificio Alto Prado Plaza",
//             bundles: [
//                 {
//                     id: "e09771db-2657-45fb-ad39-ae6604422818",
//                     quantity: 5
//                 }
//             ],
//             products: [
//                 {
//                     id: "7ea54c93-562b-4c74-8b24-040add21f5c2",
//                     quantity: 5
//                 },
//                 {
//                     id: "5c84a611-a1dd-4944-a60d-baad170c4593",
//                     quantity: 5
//                 }
//             ]
//         })
//     if(response.isFailure())
//         caughtError=response.getError
//     } catch (error) {
//     }
// })

// Then('The order should be created sucsessfully', async () => {
//     assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
// })