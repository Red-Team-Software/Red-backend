import { Result } from "src/common/utils/result-handler/result"
import { IServiceRequestDto, IServiceResponseDto, IApplicationService, IServiceDecorator } from "../../services"
<<<<<<< Updated upstream
import { ITimer } from "../../timer/timer.interface"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { ICredential } from "src/auth/application/model/credential.interface"
=======
import { ILogger } from "../../logger/logger.interface"
import { ITimer } from "../../timer/timer.interface"
import { ITransactionHandler } from "src/common/domain"
>>>>>>> Stashed changes


export class SecurityDecorator <
        I extends IServiceRequestDto,
        O extends IServiceResponseDto
> 
extends IServiceDecorator <I,O>{
    constructor ( 
        applicationService: IApplicationService<I, O>,
<<<<<<< Updated upstream
        private readonly timer: ITimer,
        private readonly userContex:ICredential,
        private readonly permitedRoles:UserRoles[]
=======
        private readonly transaction: ITransactionHandler
>>>>>>> Stashed changes
    ) {
        super(applicationService)
    }

    async execute ( input: I ): Promise<Result<O>> {
<<<<<<< Updated upstream
        if(!this.permitedRoles[this.userContex.userRole])

            throw new InvalidUserRoleException();        return result
=======
        await this.transaction.startTransaction()
        let result = await this.decoratee.execute(input)
        if(result.isSuccess()) 
            await this.transaction.commitTransaction()
        else
            await this.transaction.rollbackTransaction()
        return result
>>>>>>> Stashed changes
    }
}