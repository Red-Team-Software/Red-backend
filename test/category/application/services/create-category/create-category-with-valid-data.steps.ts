import { CreateCategoryApplication } from "src/category/application/services/command/create-category-application";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { When, Then } from "@cucumber/cucumber";
import * as assert from 'assert';
import { ErrorCreatingCategoryApplicationException } from "src/category/application/application-exception/error-creating-category-application-exception";

let service: CreateCategoryApplication;
let caughtError:any
When('Trying to create a category with name {string}', async (name: string) => {
  const categories:Category[]=[]
  const commandRepositoryMock = new CategoryCommandRepositoryMock(categories);
  const queryRepositoryMock = new CategoryQueryRepositoryMock(categories);
  const productQueryRepositoryMock = new ProductQueryRepositoryMock();
  const bundleQueryRepositoryMock = new BundleQueryRepositoryMock();

  service = new CreateCategoryApplication(
    new EventPublisherMock(),
    commandRepositoryMock,
    queryRepositoryMock,
    productQueryRepositoryMock,
    bundleQueryRepositoryMock,
    new IdGeneratorMock(),
    new FileUploaderMock()
  );

  try{
    let response = await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      name: name,
      image: Buffer.from('image-data'),
      products: ['product-1', 'product-2'], // IDs de productos simulados
      bundles: ['bundle-1', 'bundle-2'],   // IDs de bundles simulados
    });

    if (!response.isSuccess()) {
      caughtError=response.getError // Obtenemos la categoría creada
    }
  } catch (error){}
});

Then('The category should be created with the name {string}', async (name: string) => {
  assert.strictEqual( caughtError,undefined, `Expected no error but got ${caughtError}`)
    
  });
