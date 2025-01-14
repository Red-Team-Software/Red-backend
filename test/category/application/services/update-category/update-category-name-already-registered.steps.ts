import { UpdateCategoryApplicationService } from "src/category/application/services/command/update-category-application";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { When, Then } from "@cucumber/cucumber";
import * as assert from "assert";
import { ErrorNameAlreadyApplicationException } from "src/category/application/application-exception/error-name-already-application-exception";
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { Product } from "src/product/domain/aggregate/product.aggregate";

let caughtError: any;
When(
  'Trying to update a category entity with id {string} that is registered, name {string} that is already registered',
  async (id: string, name: string) => {
    const categories: Category[] = [
      Category.initializeAggregate(
        CategoryID.create(id),
        CategoryName.create("Old Category Name"),
        CategoryImage.create("http://example.com/old-category.jpg")
      ),
      Category.initializeAggregate(
        CategoryID.create("7ea54c93-562b-4c74-8b24-040add2624c9"),
        CategoryName.create(name), // Este nombre ya está registrado
        CategoryImage.create("http://example.com/registered-category.jpg")
      ),
    ];

    let products: Product[]=[]
    const commandRepositoryMock = new CategoryCommandRepositoryMock(categories);
    const queryRepositoryMock = new CategoryQueryRepositoryMock(categories);

    const service = new UpdateCategoryApplicationService(
      new EventPublisherMock(),
      commandRepositoryMock,
      queryRepositoryMock,
      new ProductQueryRepositoryMock(products),
      new FileUploaderMock(),
      new IdGeneratorMock()
    );

    try {
      const response = await service.execute({
        userId: "e09771db-2657-45fb-ad39-ae6604422919",
        categoryId: id,
        name,
        image: Buffer.from("image-data"),
        products: [],
        bundles: [],
      });

      if (!response.isSuccess()) {
        caughtError = response.getError;
      }
    } catch (error) {
    }
  }
);


Then(
  'The category should not be updated because the name is already registered',
  async () => {
    assert.ok(
      caughtError instanceof ErrorNameAlreadyApplicationException,
      `Expected ErrorNameAlreadyApplicationException but got ${caughtError}`
    );
  }
);

