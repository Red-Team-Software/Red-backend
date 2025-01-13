import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorAddressNotFoundApplicationException extends ApplicationException{
    constructor(id:string) {
        super(`Error address with id ${id} not found in the user`);
    }}