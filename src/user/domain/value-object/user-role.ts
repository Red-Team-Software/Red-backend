import { ValueObject } from "src/common/domain"
import { UserRoles } from "./enum/user.roles"
import { InvalidUserRoleException } from "../domain-exceptions/invalid-user-role-exception"

export class UserRole implements ValueObject<UserRole> {

    private readonly role: string

    equals(valueObject: UserRole): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.role }

    static create ( role: string ): UserRole {
        
        if(!UserRoles[role])
            throw new InvalidUserRoleException();

        return new UserRole( role )
    }

    private constructor(role:string){
        this.role=role
    }

}