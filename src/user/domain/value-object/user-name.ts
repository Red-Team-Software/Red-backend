import { ValueObject } from "src/common/domain"
import { InvalidUserNameException } from "../domain-exceptions/invalid-user-name-exception"

export class UserName implements ValueObject<UserName> {

    private readonly name: string

    equals(valueObject: UserName): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.name }

    static create ( name: string ): UserName {
        const regex=new RegExp(`/^[a-z0-9_-]{3,16}$/`)
        if (!regex.test(name))
            throw new InvalidUserNameException()
        return new UserName( name )
    }

    private constructor(name:string){
        this.name=name
    }

}