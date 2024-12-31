import { ProductID } from "src/product/domain/value-object/product-id"
import { EventPublisherMock } from "test/common/infraestructure/mocks/event-publisher.mock"
import { IdGeneratorMock } from "test/common/infraestructure/mocks/id-generator.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert';
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"

import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description"
import { PromotionName } from "src/promotion/domain/value-object/promotion-name"
import { PromotionAvaleableState } from "src/promotion/domain/value-object/promotion-state"
import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount"
import { CreatePromotionApplicationService } from "src/promotion/application/services/command/create-promotion-application.service"
import { PromotionCommandRepositoryMock } from '../infraestructure/mocks/repositories/promotion-command-repository.mock';
import { PromotionQueryRepositoryMock } from "../infraestructure/mocks/repositories/promotion-query-repository.mock"
import { ProductQueryRepositoryMock } from '../../product/infraestructure/mocks/repositories/product-query-repository.mock';
import { Product } from "src/product/domain/aggregate/product.aggregate"
import { ProductDescription } from "src/product/domain/value-object/product-description"
import { ProductImage } from "src/product/domain/value-object/product-image"
import { ProductName } from "src/product/domain/value-object/product-name"
import { ProductPrice } from "src/product/domain/value-object/product-price"
import { ProductStock } from "src/product/domain/value-object/product-stock"
import { ProductWeigth } from "src/product/domain/value-object/product-weigth"
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock"
import { ErrorPromotionNameAlreadyApplicationException } from "src/promotion/application/application-exepction/error-promotion-name-already-exist-application-exception";


const promotions: Promotion[] = [
  Promotion.initializeAggregate(
    PromotionId.create('e09771db-2657-45fb-ad39-ae6604422414'),
    PromotionDescription.create('Descripcion de prueba'),
    PromotionName.create('promocion navidad 2024'),
    PromotionAvaleableState.create(true),
    PromotionDiscount.create(0.20),
    [
      ProductID.create('e09771db-2657-45fb-ad39-ae6604422919')
    ],
    [
      BundleId.create('e09771db-2657-45fb-ad39-ae6604422818')
    ],
    []
  )
]

const bundles: Bundle[] = [
  Bundle.initializeAggregate(
    BundleId.create('e09771db-2657-45fb-ad39-ae6604422818'),
    BundleDescription.create('descripcion'),
    BundleName.create('arroz chino con lumpias'),
    BundleStock.create(50),
    [
      BundleImage.create('image-123')
    ],
    BundlePrice.create(50,'usd'),
    BundleWeigth.create(50,'kg'),
    [
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1')
    ]
  )
]

const products: Product[] = [
  Product.initializeAggregate(
    ProductID.create('e09771db-2657-45fb-ad39-ae6604422919'),
    ProductDescription.create('descripcion de comida china'),
    ProductName.create('comida china'),
    ProductStock.create(10),
    [ProductImage.create('prueba')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  )
]

let service= new CreatePromotionApplicationService(
  new PromotionCommandRepositoryMock(promotions),
  new PromotionQueryRepositoryMock(promotions),
  new ProductQueryRepositoryMock(products),
  new BundleQueryRepositoryMock(bundles),
  new IdGeneratorMock(),
  new EventPublisherMock()
)

let caughtError:any

When('Trying to create a promotion with a name that is already registered', async () => {
  try {
    let response=await service.execute({
      userId:"e09771db-2657-45fb-ad39-ae6604422919",
      description:"navidad 2024",
      name:"promocion navidad 2024",
      avaleableState:true,
      discount:0.50,
      products:[
        "e09771db-2657-45fb-ad39-ae6604422919"
      ],
      bundles:[
        "e09771db-2657-45fb-ad39-ae6604422818"
      ]
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The promotion should not be created because the name is already registered', async () => {
  assert.ok(
      caughtError instanceof ErrorPromotionNameAlreadyApplicationException,
      `Expected ErrorPromotionNameAlreadyApplicationException but got ${caughtError}`
  )
})