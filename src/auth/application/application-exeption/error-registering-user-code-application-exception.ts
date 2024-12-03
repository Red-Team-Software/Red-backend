import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorRegisteringUserCodeApplicationException extends ApplicationException {
  constructor() {
    super(`Error registering user code, please try again`);
  }
}
