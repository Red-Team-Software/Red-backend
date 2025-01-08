import { CreateCourierApplicationService } from "src/courier/application/services/create-courier-application.service"
import { When, Then } from "@cucumber/cucumber"
import { EventPublisherMock } from "test/common/infraestructure/mocks/event-publisher.mock"
import { CourierRepositoryMock } from "test/courier/infraestructure/mock/repositories/courier-command-repository.mock"
import { IdGeneratorMock } from "test/common/infraestructure/mocks/id-generator.mock"
import { FileUploaderMock } from "test/common/infraestructure/mocks/file-uploader.mock"
import * as assert from 'assert';

let caughtError:any

When('Trying to create a Courier with name {string}', async (name:string) => {

    let service= new CreateCourierApplicationService(
    new EventPublisherMock(),
    new CourierRepositoryMock(),
    new IdGeneratorMock(),
    new FileUploaderMock()
    )

    try {
        let response=await service.execute({
            userId: 'e09771db-2657-45fb-ad39-ae6604422919',
            name: name,
            image: Buffer.from('prueba'),
        })
    if(response.isFailure())
        caughtError=response.getError
    } catch (error) {
    }
})

Then('The courier {string} should be created successfully', async (name:string) => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})