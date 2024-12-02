import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorRegisteringSessionApplicationException extends ApplicationException {
  constructor() {
    super(`Error registering session, please try again`);
  }
}
