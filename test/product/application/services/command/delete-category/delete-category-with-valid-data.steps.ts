import { DeleteCategoryApplication } from "src/category/application/services/command/delete-category-application";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { When, Then } from "@cucumber/cucumber";
import * as assert from "assert";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";

let caughtError: any;
let service: DeleteCategoryApplication;

When('Trying to delete a category with valid id {string}', async (id: string) => {
  const categories: Category[] = [
    Category.initializeAggregate(
      CategoryID.create(id),
      CategoryName.create("category 1"),
      CategoryImage.create("http://image-123.jpg")
    ),
  ];

  const commandRepositoryMock = new CategoryCommandRepositoryMock(categories);
  service = new DeleteCategoryApplication(
    commandRepositoryMock,
    new CategoryQueryRepositoryMock(categories),
    new EventPublisherMock(),
    new FileUploaderMock()
  );

  try {
    const response = await service.execute({userId: 'e09771db-2657-45fb-ad39-ae6604422919', id});
    if (response.isFailure()) {
      caughtError = response.getError;
    }
  } catch (error) {
    caughtError = error;
  }
});

Then('The category should be deleted with id {string}', async (id: string) => {
  assert.strictEqual(
    caughtError,
    undefined,
    `Expected no error but got ${caughtError}`
  );
});
