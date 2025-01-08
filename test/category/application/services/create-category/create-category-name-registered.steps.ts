import { CreateCategoryApplication } from "src/category/application/services/command/create-category-application";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { When, Then } from "@cucumber/cucumber";
import * as assert from 'assert';
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { ErrorNameAlreadyApplicationException } from "src/category/application/application-exception/error-name-already-application-exception";

let caughtError: any;

When('Trying to create a category with name {string} that is already registered', async (name: string) => {
  const categories: Category[] = [
    Category.create(
      CategoryID.create('existing-category-id'),
      CategoryName.create(name),
      CategoryImage.create('http://image-category.jpg'),
      [],
      []
    )
  ];

  const service = new CreateCategoryApplication(
    new EventPublisherMock(),
    new CategoryCommandRepositoryMock(),
    new CategoryQueryRepositoryMock(categories),
    null, // Mock del repositorio de productos
    null, // Mock del repositorio de bundles
    new IdGeneratorMock(),
    new FileUploaderMock()
  );

  try {
    await service.execute({
      name,
      image: Buffer.from(''),
      products: [],
      bundles: []
    });
  } catch (error) {
    caughtError = error;
  }
});

Then('The category should not be created because the name {string} is already registered', async (name: string) => {
  assert.ok(
    caughtError instanceof ErrorNameAlreadyApplicationException,
    `Expected ErrorNameAlreadyApplicationException but got ${caughtError}`
  );
});
