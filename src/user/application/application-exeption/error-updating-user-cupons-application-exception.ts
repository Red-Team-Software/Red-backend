import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatinngUserCuponsApplicationException extends ApplicationException{
    constructor(idUser:string, idCoupon:string) {
        super(`Error updation user cupon with user id:${idUser} , cupon id:${idCoupon}`);
    }}