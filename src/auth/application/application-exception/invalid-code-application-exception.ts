import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class InvalidCodeApplicationException extends ApplicationException {
  constructor() {
    super('Invalid verify code');
  }
}
