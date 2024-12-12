import { Result } from "src/common/utils/result-handler/result"
import { IServiceRequestDto, IServiceResponseDto, IApplicationService, IServiceDecorator } from "../../services"
import { ITimer } from "../../timer/timer.interface"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { ICredential } from "src/auth/application/model/credential.interface"
import { SecurityException } from "../application-exceptions/security-exception"


export class SecurityDecorator <
        I extends IServiceRequestDto,
        O extends IServiceResponseDto
> 
extends IServiceDecorator <I,O>{
    constructor ( 
        decoratee: IApplicationService<I, O>,
        private readonly userContetx:ICredential,
        private readonly permitedRoles:UserRoles[]
    ) {
        super(decoratee)
    }

    async execute ( input: I ): Promise<Result<O>> {

        if(!this.permitedRoles[this.userContetx.userRole])
            return Result.fail(new SecurityException(this.userContetx.userRole,this.permitedRoles))        

        return await this.decoratee.execute(input)
    }
}