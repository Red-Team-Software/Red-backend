import { ApplicationException } from "src/common/application/application-exeption/application-exception";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";

export class SecurityException extends ApplicationException{
    constructor(rol:string,roles:UserRoles[]) {
        super(`Error the user rol: ${rol} is not in the avaleable user roles ${roles} `);
    }
}