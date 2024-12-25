import { ProductID } from "src/product/domain/value-object/product-id"
import { EventPublisherMock } from "test/common/infraestructure/mocks/event-publisher.mock"
import { BundleQueryRepositoryMock } from '../../infraestructure/mocks/repositories/bundle-query-repository.mock';
import { IdGeneratorMock } from "test/common/infraestructure/mocks/id-generator.mock"
import { FileUploaderMock } from "test/common/infraestructure/mocks/file-uploader.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert';
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate"
import { BundleId } from "src/bundle/domain/value-object/bundle-id"
import { BundleDescription } from "src/bundle/domain/value-object/bundle-description"
import { BundleName } from "src/bundle/domain/value-object/bundle-name"
import { BundleStock } from "src/bundle/domain/value-object/bundle-stock"
import { BundleImage } from "src/bundle/domain/value-object/bundle-image"
import { BundlePrice } from "src/bundle/domain/value-object/bundle-price"
import { BundleWeigth } from "src/bundle/domain/value-object/bundle-weigth"
import { CreateBundleApplicationService } from "src/bundle/application/services/command/create-bundle-application.service"
import { BundleCommadRepositoryMock } from "test/bundle/infraestructure/mocks/repositories/bundle-command-repository.mock"
import { ErrorBundleNameAlreadyApplicationException } from "src/bundle/application/application-exeption/error-bundle-name-already-exist-application-exception";


const bundles: Bundle[] = [
  Bundle.initializeAggregate(
    BundleId.create('e09771db-2657-45fb-ad39-ae6604422919'),
    BundleDescription.create('descripcion'),
    BundleName.create('arroz chino con lumpias'),
    BundleStock.create(50),
    [
      BundleImage.create('image-123')
    ],
    BundlePrice.create(50,'usd'),
    BundleWeigth.create(50,'kg'),
    [
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f5c2'),
      ProductID.create('7ea54c93-562b-4c74-8b24-040add21f4c1')
    ]
  )
]

let service= new CreateBundleApplicationService(
  new EventPublisherMock(),
  new BundleQueryRepositoryMock(bundles),
  new BundleCommadRepositoryMock(bundles),
  new IdGeneratorMock(),
  new FileUploaderMock()
)

let caughtError:any

When('Trying to create a Bundle with a name that is already registered', async () => {
  try {
    let response=await service.execute({
      userId:"e09771db-2657-45fb-ad39-ae6604422919",
      name:"arroz chino con lumpias",
      description: "arroz chino con lumpias",
      caducityDate: new Date(),
      stock: 50,
      images:[Buffer.from('prueba')],
      price:50,
      currency:'usd',
      weigth:10,
      measurement:'kg',
      productId:[
        "7ea54c93-562b-4c74-8b24-040add21f4c1",
        "7ea54c93-562b-4c74-8b24-040add21f5c2"
      ]
    })
    if(response.isFailure())
      caughtError=response.getError
  } catch (error) {
  }
})

Then('The bundle should not be created because the name is already registered', async () => {
  assert.ok(
      caughtError instanceof ErrorBundleNameAlreadyApplicationException,
      `Expected ErrorProductNameAlreadyExistApplicationException but got ${caughtError}`
  )
})