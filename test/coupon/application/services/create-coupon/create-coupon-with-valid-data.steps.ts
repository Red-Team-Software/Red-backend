
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate";

import { CouponQueryRepositoryMock } from "test/coupon/infraestructure/mocks/repositories/coupon-query-repository-mock";
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock"; 
import { FileUploaderMock } from "test/common/mocks/infraestructure/file-uploader.mock"; 
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock"; 
import * as assert from 'assert'; 
import { CreateCuponApplicationService } from "src/cupon/application/services/command/create-cupon-application-service";
import { When, Then } from "@cucumber/cucumber";
import { CouponCommandRepositoryMock } from "test/coupon/infraestructure/mocks/repositories/coupon-command-repository-mock";
import { CouponStateEnum } from "src/cupon/domain/value-object/enum/coupon.state.enum";

let caughtError: any; 

When('Trying to create a coupon with name {string}', async (name: string) => {
  const coupons: Cupon[] = [];
  
  let service = new CreateCuponApplicationService(
    new EventPublisherMock(),
    new CouponCommandRepositoryMock(coupons),
    new CouponQueryRepositoryMock(coupons),
    new IdGeneratorMock()
  );

  try {
    let response = await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919', 
      name: name, 
      code: 'BF2025',
      discount: 0.1, // Porcentaje de descuento
      state: CouponStateEnum.avaleable
    });
    if (response.isFailure()) {
      caughtError = response.getError;
    }
  } catch (error) {
    caughtError = error;
  } 
});

Then('The coupon {string} should be created successfully', async (name: string) => {
  assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`);
});
