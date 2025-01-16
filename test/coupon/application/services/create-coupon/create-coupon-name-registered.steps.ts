import { When, Then } from "@cucumber/cucumber";
import * as assert from 'assert'
import { CouponQueryRepositoryMock } from "test/coupon/infraestructure/mocks/repositories/coupon-query-repository-mock";
import { CouponCommandRepositoryMock } from "test/coupon/infraestructure/mocks/repositories/coupon-command-repository-mock";
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";
import { CuponId } from "src/cupon/domain/value-object/cupon-id";
import { CuponName } from "src/cupon/domain/value-object/cupon-name";
import { CuponCode } from "src/cupon/domain/value-object/cupon-code";
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount";
import { CuponState } from "src/cupon/domain/value-object/cupon-state";
import { CreateCuponApplicationService } from "src/cupon/application/services/command/create-cupon-application-service";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock";
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock";
import { ErrorCreatingCuponApplicationException } from "src/cupon/application/application-exception/error-creating-cupon-application-exception copy";
import { ErrorNameAlreadyApplicationException } from "src/cupon/application/application-exception/error-name-already-exist-cupon-application-exception";
import { CouponStateEnum } from "src/cupon/domain/value-object/enum/coupon.state.enum";
let caughtError:any


When('Trying to create a coupon with name {string} that is already registered', async (name: string)=> {
  // Simula que ya existe un cupón con el nombre "BlackFriday"
  const cupons:Cupon[] = [Cupon.initializeAggregate(
    CuponId.create("e09771db-2657-45fb-ad39-ae6604422919"),
    CuponName.create(name),
    CuponCode.create("BLACKFRIDAY2025"),
    CuponDiscount.create(0.2),
    CuponState.create(CouponStateEnum.avaleable)
  )]
  
  let service= new CreateCuponApplicationService(
    new EventPublisherMock(),
    new CouponCommandRepositoryMock(cupons),
    new CouponQueryRepositoryMock(cupons),
    new IdGeneratorMock()
  )
  // Intentar crear un cupon con el mismo nombre
  try {
    let response = await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422917',
      name: name,
      code: 'BF2025',
      discount: 0.2,
      state: CouponStateEnum.avaleable
    });

    if (response.isFailure()) {
      caughtError = response.getError;
    }
  } catch (error) {
  }
});

Then('The coupon should not be created because the name {string} is already registered', async (name: string) =>{
  assert.ok(
        caughtError instanceof ErrorNameAlreadyApplicationException,
        `Expected ErrorNameAlreadyApplicationException but got ${caughtError}`
    )
});
