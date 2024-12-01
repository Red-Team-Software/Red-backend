import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class UserNotVerifiedApplicationException extends ApplicationException {
  constructor() {
    super(`User not verified`);
  }
}
