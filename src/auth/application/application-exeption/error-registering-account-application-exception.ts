import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorRegisteringAccountApplicationException extends ApplicationException {
  constructor() {
    super(`Error registering account, please try again`);
  }
}
