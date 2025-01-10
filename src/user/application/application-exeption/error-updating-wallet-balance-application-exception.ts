import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatingBalanceWalletApplicationException extends ApplicationException{
    constructor() {
        super(`Error updating balance wallet`);
    }}