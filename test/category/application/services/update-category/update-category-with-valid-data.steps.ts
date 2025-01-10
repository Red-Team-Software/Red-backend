import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { UpdateCategoryApplicationService } from "src/category/application/services/command/update-category-application";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { When, Then } from "@cucumber/cucumber";
import * as assert from "assert";
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
import { ProductID } from "src/product/domain/value-object/product-id";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";

let caughtError: any;

When(
    'Trying to update a category with id {string} that is registered, name {string}, image {string}, products {string}, bundles {string}',
    async (id: string, name: string, image: string, products: string, bundles: string) => {
      const categories: Category[] = [
        Category.initializeAggregate(
          CategoryID.create(id),
          CategoryName.create("Old Category Name"),
          CategoryImage.create('http://image-123.jpg'),
          [ProductID.create("e09771db-2657-45fb-ad39-ae6604422918")],
          [BundleId.create("e09771db-2657-45fb-ad39-ae6604422917")]
        ),
      ];
  
      const commandRepositoryMock = new CategoryCommandRepositoryMock(categories);
      const queryRepositoryMock = new CategoryQueryRepositoryMock(categories);
  
      const service = new UpdateCategoryApplicationService(
        new EventPublisherMock(),
        commandRepositoryMock,
        queryRepositoryMock,
        new ProductQueryRepositoryMock(),
        new FileUploaderMock(),
        new IdGeneratorMock()
      );
  
      try {
        const response = await service.execute({
          userId: "e09771db-2657-45fb-ad39-ae6604422919",
          categoryId: id,
          name: name,
          image: Buffer.from(image), // Convertir imagen en buffer
          products: products.split(",").map((p) => p.trim()), // Convertir productos a un array
          bundles: bundles.split(",").map((b) => b.trim()),   // Convertir bundles a un array
        });
  
        if (response.isFailure()) {
          caughtError = response.getError
        }
      } catch (error) {
        caughtError = error;
      }
    }
  );
  

Then(
    'The category should be updated with id {string}, name {string}, image {string}, products {string}, bundles {string}',
    async (
    id: string,
    name: string,
    image: string,
    products: string,
    bundles: string
  ) => {
    // Verificar que no hubo errores
    assert.strictEqual(
      caughtError,
      undefined,
      `Expected no error but got ${caughtError}`
    );
  }
);
