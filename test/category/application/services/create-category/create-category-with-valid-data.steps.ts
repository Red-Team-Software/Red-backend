import { CreateCategoryApplication } from "src/category/application/services/command/create-category-application";
import { CategoryCommandRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-command-repository.mock";
import { CategoryQueryRepositoryMock } from "test/category/infraestructure/mocks/repositories/category-query-repository.mock";
import { ProductQueryRepositoryMock } from "test/product/infraestructure/mocks/repositories/product-query-repository.mock";
import { BundleQueryRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-query-repository.mock";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { When, Then } from "@cucumber/cucumber";
import * as assert from 'assert';
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductDescription } from "src/product/domain/value-object/product-description";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductImage } from "src/product/domain/value-object/product-image";
import { ProductName } from "src/product/domain/value-object/product-name";
import { ProductPrice } from "src/product/domain/value-object/product-price";
import { ProductStock } from "src/product/domain/value-object/product-stock";
import { ProductWeigth } from "src/product/domain/value-object/product-weigth";
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description";
import { BundleId } from "src/bundle/domain/value-object/bundle-id";
import { BundleImage } from "src/bundle/domain/value-object/bundle-image";
import { BundleName } from "src/bundle/domain/value-object/bundle-name";
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price";
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock";
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth";

let service: CreateCategoryApplication;
let caughtError:any
When('Trying to create a category with name {string}', async (name: string) => {
  const categories:Category[]=[]

  
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
  
  const commandRepositoryMock = new CategoryCommandRepositoryMock(categories);
  const queryRepositoryMock = new CategoryQueryRepositoryMock(categories);
  const productQueryRepositoryMock = new ProductQueryRepositoryMock(products);
  const bundleQueryRepositoryMock = new BundleQueryRepositoryMock(bundles);

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
      image: Buffer.from('image-data.jpg'),
      products: ['7ea54c93-562b-4c74-8b24-040add21f5c2', '7ea54c93-562b-4c74-8b24-040add21f4c1'], // IDs de productos simulados
      bundles: ['e09771db-2657-45fb-ad39-ae6604422919', 'e09771db-2657-45fb-ad39-ae6604422918'],   // IDs de bundles simulados
    })


    if (!response.isSuccess()) {
      caughtError=response.getError // Obtenemos la categoría creada
    }
  } catch (error){
    caughtError=error
  }
});

Then('The category should be created with the name {string}', async (name: string) => {
  assert.strictEqual( caughtError,undefined, `Expected no error but got ${caughtError}`)
});
