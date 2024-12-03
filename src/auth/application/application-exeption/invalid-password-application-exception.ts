import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class InvalidPasswordApplicationException extends ApplicationException {
  constructor() {
    super(`Invalid password`);
  }
}
