import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidOrderStateException extends DomainException {
  constructor() {
    super('The provided state is not valid');
  }
}