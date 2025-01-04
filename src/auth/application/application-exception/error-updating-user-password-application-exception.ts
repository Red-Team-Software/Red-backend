import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUpdatingUserPasswordApplicationException extends ApplicationException {
  constructor() {
    super(`Error updating user password, please try again`);
  }
}
