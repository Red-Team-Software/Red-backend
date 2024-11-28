import { ValueObject } from "src/common/domain"
import { InvalidUserEmailException } from "../domain-exceptions/invalid-user-email-exception"

export class UserEmail implements ValueObject<UserEmail> {

    private readonly email: string

    equals(valueObject: UserEmail): boolean {
        if (this.Value===valueObject.Value) return true
        return false
    }
    
    get Value(){ return this.email }

    static create ( email: string ): UserEmail {
        
        const regex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        
        if (!regex.test(email)) 
            throw new InvalidUserEmailException()
        
        return new UserEmail( email )

    }

    private constructor(email:string){
        this.email=email
    }

}