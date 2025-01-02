import { Product } from "src/product/domain/aggregate/product.aggregate"
import { ProductDescription } from "src/product/domain/value-object/product-description"
import { ProductID } from "src/product/domain/value-object/product-id"
import { ProductImage } from "src/product/domain/value-object/product-image"
import { ProductName } from "src/product/domain/value-object/product-name"
import { ProductPrice } from "src/product/domain/value-object/product-price"
import { ProductStock } from "src/product/domain/value-object/product-stock"
import { ProductWeigth } from "src/product/domain/value-object/product-weigth"
import { EventPublisherMock } from "test/common/infraestructure/mocks/event-publisher.mock"
import { ProductCommadRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-command-repository.mock"
import { FileUploaderMock } from "test/common/infraestructure/mocks/file-uploader.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert';
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock"
import { UpdateProductApplicationService } from "src/product/application/services/command/update-product-application.service"
import { IdGeneratorMock } from "test/common/infraestructure/mocks/id-generator.mock"
import { ErrorProductNameAlreadyExistApplicationException } from "src/product/application/application-exepction/error-product-name-already-exist-application-exception"
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { UpdatePromotionApplicationService } from "src/promotion/application/services/command/update-promotion-application.service"
import { PromotionCommandRepositoryMock } from "test/promotion/infraestructure/mocks/repositories/promotion-command-repository.mock"
import { PromotionQueryRepositoryMock } from "test/promotion/infraestructure/mocks/repositories/promotion-query-repository.mock"
import { BundleQueryRepositoryMock } from 'test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock';
import { Promotion } from "src/promotion/domain/aggregate/promotion.aggregate"
import { PromotionId } from "src/promotion/domain/value-object/promotion-id"
import { PromotionDescription } from "src/promotion/domain/value-object/promotion-description"
import { PromotionName } from "src/promotion/domain/value-object/promotion-name"
import { PromotionState } from "src/promotion/domain/value-object/promotion-state"
import { PromotionDiscount } from "src/promotion/domain/value-object/promotion-discount"

let caughtError:any


When(
  'Trying to update a promotion with id {string} that is registered, name {string}, description {string}, state {string}, discount {float}, products {string} {string}, bundles {string} {string}, and category {string}',
  async (
    id: string,
    name: string,
    description: string,
    state: string,
    discount: number,
    productid1: string,
    productid2: string,
    bundleid1: string,
    bundleid2:string,
    categoryid1: string
  ) => {

  const promotions:Promotion[]=[
    Promotion.initializeAggregate(
      PromotionId.create(id),
      PromotionDescription.create('descripcion'),
      PromotionName.create('name test'),
      PromotionState.create('avaleable'),
      PromotionDiscount.create(0.01),
      [],
      [],
      []
    )
  ]

  const products: Product[] = [

    Product.initializeAggregate(
      ProductID.create(productid1),
      ProductDescription.create('descripcion de comida cachito'),
      ProductName.create(name),
      ProductStock.create(10),
      [
        ProductImage.create('http://image-123.jpg')
      ],
      ProductPrice.create(10,'usd'),
      ProductWeigth.create(10,'kg')
    ),
    Product.initializeAggregate(
      ProductID.create(productid2),
      ProductDescription.create('descripcion de comida cachito'),
      ProductName.create(name),
      ProductStock.create(10),
      [
        ProductImage.create('http://image-123.jpg')
      ],
      ProductPrice.create(10,'usd'),
      ProductWeigth.create(10,'kg')
    )
  ]

  let bundles:Bundle[]=[
      Bundle.initializeAggregate(
        BundleId.create(bundleid1),
        BundleDescription.create('descripcion'),
        BundleName.create('bundle de prueba 1'),
        BundleStock.create(50),
        [
          BundleImage.create('http://image-123.jpg')
        ],
        BundlePrice.create(5,'usd'),
        BundleWeigth.create(5,'g'),
        [
          ProductID.create(productid1),
          ProductID.create(productid2)
        ]
      ),

      Bundle.initializeAggregate(
        BundleId.create(bundleid2),
        BundleDescription.create('descripcion'),
        BundleName.create('bundle de prueba 2'),
        BundleStock.create(50),
        [
          BundleImage.create('http://image-123.jpg')
        ],
        BundlePrice.create(50,'usd'),
        BundleWeigth.create(50,'kg'),
        [
          ProductID.create(productid1),
          ProductID.create(productid2)
        ]
      )
  ]
  
  let service= new UpdatePromotionApplicationService(
    new PromotionCommandRepositoryMock(promotions),
    new PromotionQueryRepositoryMock(promotions),
    new ProductQueryRepositoryMock(products),
    new BundleQueryRepositoryMock(bundles),
    new EventPublisherMock()
  )
  
  try {
    let response=await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      id,
      name,
      description,
      state,
      discount,
      products:[productid1,productid2],
      bundles:[bundleid1,bundleid2]      
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The promotion should be updated of the id {string}',
async (
  id:string
) => {
  console.log(caughtError)
  assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})