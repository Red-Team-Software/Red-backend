import { CreateCuponApplicationService } from 'src/cupon/application/services/command/create-cupon-application-service';
import { Cupon } from 'src/cupon/domain/aggregate/cupon.aggregate';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { CuponName } from 'src/cupon/domain/value-object/cupon-name';
import { CuponCode } from 'src/cupon/domain/value-object/cupon-code';
import { CuponDiscount } from 'src/cupon/domain/value-object/cupon-discount';
import { CuponState } from 'src/cupon/domain/value-object/cupon-state';
import { CuponCommandRepositoryMock } from '../../infraestructure/coupon-command-repository-mock';
import { When, Then } from '@cucumber/cucumber';
import * as assert from 'assert';
import { ErrorNameAlreadyApplicationException } from 'src/cupon/application/application-exception/error-name-already-exist-cupon-application-exception';
import { CuponQueryRepositoryMock } from '../../infraestructure/mocks/repositories/coupon-query-repository-mock';
import { EventPublisherMock } from 'test/common/mocks/infraestructure/event-publisher.mock';
import { IdGeneratorMock } from 'test/common/mocks/infraestructure/id-generator.mock';

let caughtError: any;

When('Trying to create a cupon with name {string} that is already registered', async (name: string) => {
  const cupones: Cupon[] = [
    Cupon.initializeAggregate(
      CuponId.create('e09771db-2657-45fb-ad39-ae6604422919'),
      CuponName.create(name),
      CuponCode.create('BF2025'),
      CuponDiscount.create(20),
      CuponState.create('ACTIVE')
    )
  ];

  let service = new CreateCuponApplicationService(
    new EventPublisherMock(),
    new CuponCommandRepositoryMock(cupones),
    new CuponQueryRepositoryMock(cupones),
    new IdGeneratorMock()
  );

  try {
    let response = await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      name: name,
      code: 'BF2025',
      discount: 20,
      state: 'ACTIVE'
    });
    if (response.isFailure()) {
      caughtError = response.getError;
    }
  } catch (error) {}
});

Then('The cupon should not be created because the name {string} is already registered', async (name: string) => {
  assert.ok(
    caughtError instanceof ErrorNameAlreadyApplicationException,
    `Expected ErrorNameAlreadyApplicationException but got ${caughtError}`
  );
});
