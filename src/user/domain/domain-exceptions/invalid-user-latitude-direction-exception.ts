import { DomainException } from "src/common/domain/domain-exeption/domain-exception";

export class InvalidUserLatitudeDirectionException extends DomainException{
    constructor(lat:string){super(`The user direction latitude is invalid lat:${lat}`)}
}