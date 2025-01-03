import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidOrderUserIdException extends DomainException {
  constructor() {
    super('The provided user id is not a Uuid');
  }
}