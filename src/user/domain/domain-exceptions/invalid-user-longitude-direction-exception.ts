import { DomainException } from "src/common/domain/domain-exception/domain-exception";
export class InvalidUserLongitudeDirectionException extends DomainException{
    constructor(lng:string){super(`The user direction longitude is invalid lat:${lng}`)}
}