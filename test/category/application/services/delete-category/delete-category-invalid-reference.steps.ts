import { DeleteCategoryApplication } from "src/category/application/services/command/delete-category-application";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { When, Then } from "@cucumber/cucumber";
import * as assert from "assert";
import { NotFoundCategoryApplicationException } from "src/category/application/application-exception/not-found-category-application-exception";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";

let caughtError: any;
let service: DeleteCategoryApplication

When('Trying to delete a category with id {string}', async (id: string) => {
  const categories: Category[] = [
    Category.initializeAggregate(CategoryID.create("e09771db-2657-45fb-ad39-ae6604322919"),
CategoryName.create("name1"),
CategoryImage.create("http://imagen.jpg"))
  ]; // No categories in the repository

  const commandRepositoryMock = new CategoryCommandRepositoryMock(categories);
  service = new DeleteCategoryApplication(
    commandRepositoryMock,
    new CategoryQueryRepositoryMock(categories),
    new EventPublisherMock(),
    new FileUploaderMock()
  );

  try {
    const response = await service.execute({ userId: 'e09771db-2657-45fb-ad39-ae6604422919',id });
    if (response.isFailure()) {
      caughtError = response.getError;
    }
  } catch (error) {
  }
});

Then('The category should not be deleted because the id {string} is not registered', async (id:string) => {
  assert.ok(
    caughtError instanceof NotFoundException,
    `Expected NotFoundException but got ${caughtError}`
  );
});
