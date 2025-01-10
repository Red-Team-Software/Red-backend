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
import { DeleteProductApplicationService } from "src/product/application/services/command/delete-product-application.service"
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock"
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock"

let caughtError:any

When('Trying to delete a product with id {string} that is registered',
   async (id:string) => {

  const products: Product[] = [
    Product.initializeAggregate(
      ProductID.create(id),
      ProductDescription.create('descripcion de comida china'),
      ProductName.create('cachito'),
      ProductStock.create(10),
      [
        ProductImage.create('http://image-123.jpg')
      ],
      ProductPrice.create(10,'usd'),
      ProductWeigth.create(10,'kg')
    )
  ]
  
  let service= new DeleteProductApplicationService(
    new EventPublisherMock(),
    new ProductCommadRepositoryMock(products),
    new ProductQueryRepositoryMock(products),
    new FileUploaderMock()
  )
  
  try {
    let response=await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      id
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
    caughtError=error
  }
})


Then('The product should be deleted because the id {string} is registered', async (name:string) => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})