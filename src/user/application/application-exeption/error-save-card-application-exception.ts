import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorSaveCardApplicationException extends ApplicationException {
  constructor() {
    super(`Error saving card, please try again`);
  }
}
