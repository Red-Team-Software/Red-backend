import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class UserNotFoundApplicationException extends ApplicationException {
  constructor(id:string) {
    super(`User with id ${id} not found`);
  }
}
