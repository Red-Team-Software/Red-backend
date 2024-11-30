import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class UserNotFoundApplicationException extends ApplicationException {
  constructor() {
    super(`User not found`);
  }
}
