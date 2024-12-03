import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserLongitudeDirectionException extends DomainException{
    constructor(lng:string){super(`The user direction longitude is invalid lat:${lng}`)}
}