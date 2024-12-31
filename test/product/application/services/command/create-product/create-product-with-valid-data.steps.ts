import { CreateProductApplicationService } from "src/product/application/services/command/create-product-application.service"
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
import { IdGeneratorMock } from "test/common/infraestructure/mocks/id-generator.mock"
import { FileUploaderMock } from "test/common/infraestructure/mocks/file-uploader.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert';
import { ErrorProductNameAlreadyExistApplicationException } from "src/product/application/application-exepction/error-product-name-already-exist-application-exception"
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock"

let caughtError:any

When('Trying to create a Bundle with name {string}', async (name:string) => {

  const products: Product[] = []
  
  let service= new CreateProductApplicationService(
    new EventPublisherMock(),
    new ProductCommadRepositoryMock(products),
    new ProductQueryRepositoryMock(products),
    new IdGeneratorMock(),
    new FileUploaderMock()
  )
  
  try {
    let response=await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      name: name,
      description: 'descripcion',
      caducityDate: new Date(),
      stock: 50,
      images: [Buffer.from('prueba')],
      price:45,
      currency:'usd',
      weigth:50,
      measurement:'kg'
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The product {string} should be created successfully', async (name:string) => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})