import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class CodeExpiredApplicationException extends ApplicationException {
  constructor() {
    super('Code expired');
  }
}
