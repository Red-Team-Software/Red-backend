import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorRegisteringUserApplicationException extends ApplicationException {
  constructor() {
    super(`Error registering user, please try again`);
  }
}
