import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorUserCardsNotFoundApplicationException extends ApplicationException {
  constructor() {
    super(`The user dont have cards registered`);
  }
}
