import { CreateCategoryApplication } from "src/category/application/services/create-category-application";
import { When, Then } from "@cucumber/cucumber";
import * as assert from 'assert';
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";

let response: any;

When('Trying to create a category with name {string}', async (name: string) => {
  const service = new CreateCategoryApplication(
    new EventPublisherMock(),
    new CategoryCommandRepositoryMock(),
    new CategoryQueryRepositoryMock([]),
    null, // Mock del repositorio de productos
    null, // Mock del repositorio de bundles
    new IdGeneratorMock(),
    new FileUploaderMock()
  );

  response = await service.execute({
    name,
    image: Buffer.from(''),
    products: [],
    bundles: []
  });
});

Then('The category should be created with the name {string}', async (name: string) => {
  assert.ok(response.isSuccess(), 'The category creation failed');
  assert.strictEqual(response.getValue.name, name);
});