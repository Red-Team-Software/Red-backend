import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class NotFoundCouponApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error the coupon with id ${id} is not found`);
    }
}