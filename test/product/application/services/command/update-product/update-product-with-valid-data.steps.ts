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

let caughtError:any

When(
  'Trying to update a product with id {string} that is registered, name {string}, description {string}, date {string}, stock {int}, images {string}, price {float}, currency {string}, weigth {float}, measurement {string}',
  async (
    id: string,
    name: string,
    description: string,
    date: string,
    stock: number,
    images: string,
    price: number,
    currency: string,
    weigth: number,
    measurement: string
  ) => {
    
  const products: Product[] = [
    Product.initializeAggregate(
      ProductID.create(id),
      ProductDescription.create('descripcion de comida china'),
      ProductName.create('cachito'),
      ProductStock.create(stock),
      [
        ProductImage.create('http://image-123.jpg')
      ],
      ProductPrice.create(10,'usd'),
      ProductWeigth.create(10,'kg')
    )
  ]
  
  let service= new UpdateProductApplicationService(
    new EventPublisherMock(),
    new ProductCommadRepositoryMock(products),
    new ProductQueryRepositoryMock(products),
    new FileUploaderMock(),
    new IdGeneratorMock()
  )
  
  try {
    let response=await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      productId:id,
      name: name,
      description: description,
      caducityDate: new Date(date),
      stock: stock,
      images:images.split(',').map((img) => Buffer.from(img.trim())),
      price:price,
      currency:currency,
      weigth:weigth,
      measurement:measurement
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The product should be updated with id {string}, name {string}, description {string}, date {string}, stock {int}, images {string}, price {float}, currency {string}, weigth {float}, measurement {string}',
async (
  id: string,
  name: string,
  description: string,
  date: string,
  stock: number,
  images: string,
  price: number,
  currency: string,
  weigth: number,
  measurement: string
) => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})