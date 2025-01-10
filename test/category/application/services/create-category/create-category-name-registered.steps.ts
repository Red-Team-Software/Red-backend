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
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock";
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
import { response } from "express";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleImage } from "src/bundle/domain/value-object/bundle-image";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price";
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock";
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductPrice } from "src/product/domain/value-object/product-price";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductWeigth } from "src/product/domain/value-object/product-weigth";

let caughtError: any;

When('Trying to create a category with name {string} that is already registered', async (name: string) => {
  const categories: Category[] = [
    Category.create(
      CategoryID.create('e09771db-2657-45fb-ad39-ae6604422919'),
      CategoryName.create(name),
      CategoryImage.create('http://example.com/electronics.jpg'),
      [],
      []
    )
  ];

  const bundles: Bundle[] = [
    Bundle.initializeAggregate(
      BundleId.create('e09771db-2657-45fb-ad39-ae6604422919'),
      BundleDescription.create('descripcion'),
      BundleName.create('bundle 1'),
      BundleStock.create(50),
      [
        BundleImage.create('http://image-123.jpg')
      ],
      BundlePrice.create(50,'usd'),
      BundleWeigth.create(50,'kg'),
      [
        ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
        ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1')
      ]
    ),
    Bundle.initializeAggregate(
      BundleId.create('e09771db-2657-45fb-ad39-ae6604422918'),
      BundleDescription.create('descripcion'),
      BundleName.create('bundle 2'),
      BundleStock.create(50),
      [
        BundleImage.create('http://image-123.jpg')
      ],
      BundlePrice.create(50,'usd'),
      BundleWeigth.create(50,'kg'),
      [
        ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
        ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1')
      ]
    )
  ]
  
  const products: Product[] = [
    Product.initializeAggregate(
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
      ProductDescription.create('descripcion de comida china'),
      ProductName.create('comida china'),
      ProductStock.create(10),
      [ProductImage.create('http://image-123.jpg')],
      ProductPrice.create(10,'usd'),
      ProductWeigth.create(10,'kg')
    ),
    Product.initializeAggregate(
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1'),
      ProductDescription.create('descripcion de comida japonesa'),
      ProductName.create('comida japonesa'),
      ProductStock.create(10),
      [ProductImage.create('http://image-123.jpg')],
      ProductPrice.create(10,'usd'),
      ProductWeigth.create(10,'kg')
    )
  ]

  const service = new CreateCategoryApplication(
    new EventPublisherMock(),
    new CategoryCommandRepositoryMock(categories),
    new CategoryQueryRepositoryMock(categories),
    new ProductQueryRepositoryMock(products),
    new BundleQueryRepositoryMock(bundles),
    new IdGeneratorMock(),
    new FileUploaderMock()
  );

  try {
    let response= await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      name,
      image: Buffer.from('image-data'),
      products: ['7ea54c93-562b-4c74-8b24-040add21f5c2', '7ea54c93-562b-4c74-8b24-040add21f5c1'], 
      bundles: ['e09771db-2657-45fb-ad39-ae6604422919', 'e09771db-2657-45fb-ad39-ae6604422918'],   
    });
    if(!response.isSuccess()){
      caughtError = response.getError
    }  
} catch (error) {
    
  }
});

Then('The category should not be created because the name {string} is already registered', async (name: string) => {
  assert.ok(
    caughtError instanceof ErrorNameAlreadyApplicationException,
    `Expected ErrorNameAlreadyApplicationException but got ${caughtError}`
  );
});
