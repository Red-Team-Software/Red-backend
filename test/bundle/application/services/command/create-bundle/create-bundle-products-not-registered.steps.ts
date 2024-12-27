import { ProductID } from "src/product/domain/value-object/product-id"
import { EventPublisherMock } from "test/common/infraestructure/mocks/event-publisher.mock"
import { IdGeneratorMock } from "test/common/infraestructure/mocks/id-generator.mock"
import { FileUploaderMock } from "test/common/infraestructure/mocks/file-uploader.mock"
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
import { CreateBundleApplicationService } from "src/bundle/application/services/command/create-bundle-application.service"
import { BundleCommadRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-command-repository.mock"
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductPrice } from "src/product/domain/value-object/product-price";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductWeigth } from "src/product/domain/value-object/product-weigth";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock"

let caughtError:any

When('Trying to create a Bundle with product id {string}, {string} that is not registered', async (productIdRegistered:string,productIdNotRegistered:string) => {

const bundles: Bundle[] = [
  Bundle.initializeAggregate(
    BundleId.create('e09771db-2657-45fb-ad39-ae6604422919'),
    BundleDescription.create('descripcion'),
    BundleName.create('comida china'),
    BundleStock.create(50),
    [
      BundleImage.create('image-123')
    ],
    BundlePrice.create(50,'usd'),
    BundleWeigth.create(50,'kg'),
    [
      ProductID.create(productIdRegistered),
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1')
    ]
  )
]

const products: Product[] = [
  Product.initializeAggregate(
    ProductID.create(productIdRegistered),
    ProductDescription.create('descripcion de comida china'),
    ProductName.create('comida china'),
    ProductStock.create(10),
    [ProductImage.create('prueba')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  ),
  Product.initializeAggregate(
    ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1'),
    ProductDescription.create('descripcion de comida japonesa'),
    ProductName.create('comida japonesa'),
    ProductStock.create(10),
    [ProductImage.create('prueba')],
    ProductPrice.create(10,'usd'),
    ProductWeigth.create(10,'kg')
  )
]

let service= new CreateBundleApplicationService(
  new EventPublisherMock(),
  new BundleQueryRepositoryMock(bundles),
  new BundleCommadRepositoryMock(bundles),
  new ProductQueryRepositoryMock(products),
  new IdGeneratorMock(),
  new FileUploaderMock()
)

  try {
    let response=await service.execute({
      userId:"e09771db-2657-45fb-ad39-ae6604422919",
      name:'comida talibana',
      description: "kebab",
      caducityDate: new Date(),
      stock: 50,
      images:[Buffer.from('prueba')],
      price:50,
      currency:'usd',
      weigth:10,
      measurement:'kg',
      productId:[
        productIdRegistered,
        productIdNotRegistered
      ]
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The bundle should not be created because the product {string}, is not registered', async (productIdNotRegistered:string) => {
  assert.ok(
      caughtError instanceof NotFoundException,
      `Expected NotFoundException but got ${caughtError}`
  )
})