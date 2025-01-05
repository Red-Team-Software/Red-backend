import { CreateProductApplicationService } from "src/product/application/services/command/create-product-application.service"
import { Product } from "src/product/domain/aggregate/product.aggregate"
import { ProductCommadRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-command-repository.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert';
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock"
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";

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