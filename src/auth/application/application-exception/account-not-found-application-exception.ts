import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class AccountNotFoundApplicationException extends ApplicationException {
  constructor(email:string) {
    super(`Account with ${email} not found`);
  }
}
