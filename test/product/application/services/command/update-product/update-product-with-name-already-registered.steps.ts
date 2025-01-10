import { Product } from "src/product/domain/aggregate/product.aggregate"
import { ProductDescription } from "src/product/domain/value-object/product-description"
import { ProductID } from "src/product/domain/value-object/product-id"
import { ProductImage } from "src/product/domain/value-object/product-image"
import { ProductName } from "src/product/domain/value-object/product-name"
import { ProductPrice } from "src/product/domain/value-object/product-price"
import { ProductStock } from "src/product/domain/value-object/product-stock"
import { ProductWeigth } from "src/product/domain/value-object/product-weigth"
import { ProductCommadRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-command-repository.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert';
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock"
import { UpdateProductApplicationService } from "src/product/application/services/command/update-product-application.service"
import { ErrorProductNameAlreadyExistApplicationException } from "src/product/application/application-exepction/error-product-name-already-exist-application-exception"
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock"
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock"
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock"

let caughtError:any

When(
  'Trying to update a product with id {string} that is registered, name {string} that is already registered',
  async (
    id: string,
    name: string,
  ) => {
    
  const products: Product[] = [
    Product.initializeAggregate(
      ProductID.create(id),
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
      name: name
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The product should not be updated because the name is already registered',
async () => {
    assert.ok(
        caughtError instanceof ErrorProductNameAlreadyExistApplicationException,
        `Expected ErrorProductNameAlreadyExistApplicationException but got ${caughtError}`
    )
})