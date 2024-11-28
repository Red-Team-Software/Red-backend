import { ValueObject } from "src/common/domain"
import { InvalidUserPhoneException } from "../domain-exceptions/invalid-user-phone-exception"

export class UserPhone implements ValueObject<UserPhone> {

    private readonly phone: string

    equals(valueObject: UserPhone): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.phone }

    static create ( phone: string ): UserPhone {
        
        const regex=new RegExp(/^(\+?)([0-9]{1,3})(\s?)(\(?)([0-9]{1,3})(\)?)(\s?)([0-9]{3,4})(\s?)([0-9]{3,4})$/)

        if(!regex.test(phone))
            throw new InvalidUserPhoneException();

        return new UserPhone( phone )
    }

    private constructor(phone:string){
        this.phone=phone
    }

}