import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class InvalidCourierPasswordApplicationException extends ApplicationException {
  constructor() {
    super(`Invalid password`);
  }
}
