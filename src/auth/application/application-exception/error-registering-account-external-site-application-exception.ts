import { ApplicationException } from "src/common/application/application-exeption/application-exception";

export class ErrorRegisteringAccountExternalSiteApplicationException extends ApplicationException {
  constructor() {
    super(`Error registering account in external site, please try again`);
  }
}
