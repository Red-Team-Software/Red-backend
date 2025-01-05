import { ProductID } from "src/product/domain/value-object/product-id"
import { EventPublisherMock } from "test/common/infraestructure/mocks/event-publisher.mock"
import { FileUploaderMock } from "test/common/infraestructure/mocks/file-uploader.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert'
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { BundleCommadRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-command-repository.mock"
import { Product } from "src/product/domain/aggregate/product.aggregate"
import { ProductDescription } from "src/product/domain/value-object/product-description"
import { ProductImage } from "src/product/domain/value-object/product-image"
import { ProductName } from "src/product/domain/value-object/product-name"
import { ProductPrice } from "src/product/domain/value-object/product-price"
import { ProductStock } from "src/product/domain/value-object/product-stock"
import { ProductWeigth } from "src/product/domain/value-object/product-weigth"
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock"
import { DeleteBundleApplicationService } from "src/bundle/application/services/command/delete-bundle-application.service"
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception"


let caughtError:any
let eventPublisher=new EventPublisherMock()

When('Trying to delete a Bundle with valid id {string}, that is registered',
  async (bundleId: string) => {
  
    const bundles: Bundle[] = [
    Bundle.initializeAggregate(
    BundleId.create(bundleId),
    BundleDescription.create('descripcion'),
    BundleName.create('comida china'),
    BundleStock.create(50),
    [
      BundleImage.create('http://image-123.jpg')
    ],
    BundlePrice.create(50,'usd'),
    BundleWeigth.create(50,'kg'),
    [
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c8'),
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c7')
    ]
  )
]

const products: Product[] = [
  Product.initializeAggregate(
    ProductID.create("7ea54c93-562b-4c74-8b24-040add21f4c8"),
    ProductDescription.create('descripcion de comida china'),
    ProductName.create('comida china'),
    ProductStock.create(10),
    [ProductImage.create('http://image-123.jpg')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  ),
  Product.initializeAggregate(
    ProductID.create("7ea54c93-562b-4c74-8b24-040add21f4c7"),
    ProductDescription.create('descripcion de comida japonesa'),
    ProductName.create('comida japonesa'),
    ProductStock.create(10),
    [ProductImage.create('http://image-123.jpg')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  )
]

let service= new DeleteBundleApplicationService(
  eventPublisher,
  new BundleCommadRepositoryMock(bundles),
  new BundleQueryRepositoryMock(bundles),
  new FileUploaderMock()
)

  try {
    let response=await service.execute({
      userId:"e09771db-2657-45fb-ad39-ae6604422919",
      id:bundleId
    })
    if(response.isFailure())
      caughtError=response.getError
  } 
  catch (error) {
    caughtError=error
  }
})

Then('The bundle {string} should be deleted successfully', async (bundleId: string) => {
  assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})