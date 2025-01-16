import { MarkCuponAsUsedApplicationService } from "src/cupon/application/services/command/mark-cupon-used-application-service"
import { CuponId } from "src/cupon/domain/value-object/cupon-id"
import { CuponCode } from "src/cupon/domain/value-object/cupon-code"
import { CuponState } from "src/cupon/domain/value-object/cupon-state"
import { CuponDiscount } from "src/cupon/domain/value-object/cupon-discount"
import { CuponUserInvalidUseApplicationException } from "src/cupon/application/application-exception/cupon-user-invalid-use-application-exception"
import { UserId } from "src/user/domain/value-object/user-id"
import { EventPublisherMock } from "test/common/mocks/infraestructure/event-publisher.mock"
import { CouponCommandRepositoryMock } from "test/coupon/infraestructure/mocks/repositories/coupon-command-repository-mock"
import { CouponQueryRepositoryMock } from "test/coupon/infraestructure/mocks/repositories/coupon-query-repository-mock"
import { UserQueryRepositoryMock } from "test/user/infraestructure/mocks/repositories/user-query-repository.mock"
import { When, Then } from "@cucumber/cucumber"
import * as assert from 'assert'
import { CouponStateEnum } from "src/cupon/domain/value-object/enum/coupon.state.enum"
import { Cupon } from "src/cupon/domain/aggregate/cupon.aggregate"
import { CuponName } from "src/cupon/domain/value-object/cupon-name"
import { User } from "src/user/domain/aggregate/user.aggregate"
import { UserName } from "src/user/domain/value-object/user-name"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserRole } from "src/user/domain/value-object/user-role"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { UserDirection } from "src/user/domain/entities/directions/direction.entity"
import { Wallet } from "src/user/domain/entities/wallet/wallet.entity"
import { UserImage } from "src/user/domain/value-object/user-image"
import { IdGeneratorMock } from "test/common/mocks/infraestructure/id-generator.mock"
import { DirectionId } from "src/user/domain/entities/directions/value-objects/direction-id"
import { DirectionFavorite } from "src/user/domain/entities/directions/value-objects/direction-favorite"
import { DirectionLat } from "src/user/domain/entities/directions/value-objects/direction-lat"
import { DirectionLng } from "src/user/domain/entities/directions/value-objects/direction-lng"
import { DirectionName } from "src/user/domain/entities/directions/value-objects/direction-name"
import { Ballance } from "src/user/domain/entities/wallet/value-objects/balance"
import { WalletId } from "src/user/domain/entities/wallet/value-objects/wallet-id"
import { AddUserCouponApplicationService } from "src/user/application/services/command/add-user-coupon-application.service"
import { UserCommandRepositoryMock } from "test/user/infraestructure/mocks/repositories/user-command-repository.mock"

let caughtError: any

When('Trying to mark the coupon with id {string} as used for user {string}', async (couponId: string, userId: string) => {
    const cupon = Cupon.initializeAggregate(
        CuponId.create(couponId),
        CuponName.create("name"),
        CuponCode.create('BLACKFRIDAY2025'),
        CuponDiscount.create(0.2),
        CuponState.create(CouponStateEnum.avaleable)
    )

    const user = User.initializeAggregate(
        UserId.create(userId),
        UserName.create('prueba'),
        UserPhone.create('0412555555'),
        UserRole.create(UserRoles.CLIENT),
        [UserDirection.create(
                DirectionId.create('e09771db-2657-45fb-ad39-ae6604422919'),
                DirectionFavorite.create(true),
                DirectionLat.create(45),
                DirectionLng.create(4),
                DirectionName.create('test'))],
        Wallet.create(WalletId.create('e09771db-2657-45fb-ad39-ae6604422919'),Ballance.create(10,'usd')),
        [],
        UserImage.create('http://image-123.jpg')
)

    const service = new AddUserCouponApplicationService(
        new UserCommandRepositoryMock([user]),
        new UserQueryRepositoryMock([user], new IdGeneratorMock()),
        new CouponQueryRepositoryMock([cupon]),
        new EventPublisherMock()
    )

    try {
        let response = await service.execute({
            userId: userId,
            idCoupon: couponId
        })
        if (response.isFailure()) {
            caughtError = response.getError
        }
    } catch (error) {
        caughtError = error
    }
    
    let couponUsed=user.verifyCouponById(cupon.getId())
    if(!couponUsed){
        caughtError=new Error('Coupon not used')
    }
})

Then('The coupon should be marked as used successfully', async () => {
    assert.strictEqual(caughtError, undefined, `Expected no error but got ${caughtError}`)
})


