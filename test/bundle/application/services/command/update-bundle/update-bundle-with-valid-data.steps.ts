import { ProductID } from "src/product/domain/value-object/product-id"
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
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock"
import { Product } from "src/product/domain/aggregate/product.aggregate"
import { ProductDescription } from "src/product/domain/value-object/product-description"
import { ProductImage } from "src/product/domain/value-object/product-image"
import { ProductName } from "src/product/domain/value-object/product-name"
import { ProductPrice } from "src/product/domain/value-object/product-price"
import { ProductStock } from "src/product/domain/value-object/product-stock"
import { ProductWeigth } from "src/product/domain/value-object/product-weigth"
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock"
import { Optional } from "src/common/utils/optional/optional"
import { CreateBundleApplicationResponseDTO } from "src/bundle/application/dto/response/create-bundles-application-response-dto"
import { UpdateBundleApplicationService } from "src/bundle/application/services/command/update-bundle-application.service"
import { UpdateBundleApplicationResponseDTO } from "src/bundle/application/dto/response/update-bundle-application-response-dto"
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock"
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock"
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock"


let caughtError:any
let caugthValue=Optional.createEmpty<CreateBundleApplicationResponseDTO>()
let eventPublisher=new EventPublisherMock()

When(
  'Trying to update a bundle with id {string} that is registered, name {string}, description {string}, caducity date {string}, stock {int}, images {string}, price {float}, currency {string}, weight {float}, measurement {string}, and products with id {string} {string}',
  async (
    id: string,
    name: string,
    description: string,
    caducityDate: string,
    stock: number,
    images: string,
    price: number,
    currency: string,
    weigth: number,
    measurement: string,
    productIdRegistered1: string,
    productIdRegistered2:string
  ) => {
  

const bundles: Bundle[] = [
  Bundle.initializeAggregate(
    BundleId.create(id),
    BundleDescription.create('descripcion'),
    BundleName.create('comida china'),
    BundleStock.create(50),
    [
      BundleImage.create('http://image-123.jpg')
    ],
    BundlePrice.create(50,'usd'),
    BundleWeigth.create(50,'kg'),
    [
      ProductID.create(productIdRegistered1),
      ProductID.create(productIdRegistered2)
    ]
  )
]

const products: Product[] = [
  Product.initializeAggregate(
    ProductID.create(productIdRegistered1),
    ProductDescription.create('descripcion de comida china'),
    ProductName.create('comida china'),
    ProductStock.create(10),
    [ProductImage.create('http://image-123.jpg')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  ),
  Product.initializeAggregate(
    ProductID.create(productIdRegistered2),
    ProductDescription.create('descripcion de comida japonesa'),
    ProductName.create('comida japonesa'),
    ProductStock.create(10),
    [ProductImage.create('http://image-123.jpg')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  )
]

let service= new UpdateBundleApplicationService(
  eventPublisher,
  new BundleQueryRepositoryMock(bundles),
  new BundleCommadRepositoryMock(bundles),
  new ProductQueryRepositoryMock(products),
  new IdGeneratorMock(),
  new FileUploaderMock()
)

  try {
    let response=await service.execute({
      userId:"e09771db-2657-45fb-ad39-ae6604422919",
      bundleId:id,
      name,
      description,
      caducityDate:new Date(caducityDate),
      stock,
      images:images.split(',').map(i=>Buffer.from(i)),
      price,
      currency,
      weigth:weigth,
      measurement,
      productId:[
        productIdRegistered1,
        productIdRegistered2
      ]
    })
    if(response.isFailure())
      caughtError=response.getError
    else
      caugthValue=Optional.createWithValue<UpdateBundleApplicationResponseDTO>(response.getValue)
  } catch (error) {
  }
})



Then(
  'The bundle should be updated with id {string}, name {string}, description {string}, caducity date {string}, stock {int}, images {string}, price {float}, currency {string}, weight {float}, measurement {string}, and products with id {string} {string}',
  async (
    id: string,
    name: string,
    description: string,
    caducityDate: string,
    stock: number,
    images: string,
    price: number,
    currency: string,
    weight: number,
    measurement: string,
    product1: string,
    product2:string
  ) => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`)
  }
)