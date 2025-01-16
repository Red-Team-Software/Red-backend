import { RegisterCourierApplicationService } from "src/courier/application/services/register-courier-application.service"
import { When, Then } from "@cucumber/cucumber"
import { CourierRepositoryMock } from "test/courier/infraestructure/mock/repositories/courier-command-repository.mock"
import * as assert from 'assert';
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { CryptoMock } from "test/common/mocks/infraestructure/crypto.mock";
import { IdTokenGeneratorMock } from "test/common/mocks/infraestructure/id-token-generator.mock";
import { MessagePublisherMock } from "test/common/mocks/infraestructure/message-publisher.mock";

let caughtError:any

When('Trying to create a courier with name {string}', async (name:string) => {

    let service= new RegisterCourierApplicationService(
    new EventPublisherMock(),
    new CourierRepositoryMock(),
    new IdGeneratorMock(),
    new FileUploaderMock(),
    new IdTokenGeneratorMock(),
    new CryptoMock(),
    new MessagePublisherMock([])
    )

    try {
        let response=await service.execute({
            userId: 'e09771db-2657-45fb-ad39-ae6604422919',
            name: name,
            image: Buffer.from('prueba'),
            lat: 45,
            long: 25,
            email: 'gadeso2003@gmail.com',
            password: 'password'
        })
    if(response.isFailure())
        caughtError=response.getError
    } catch (error) {
    }
})

Then('The courier {string} is sucsessfully registered', async (name:string) => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
})