import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorSaveTransactionApplicationException extends ApplicationException {
  constructor() {
    super(`Error saving transaction`);
  }
}
