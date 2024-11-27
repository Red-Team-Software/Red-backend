import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { RegisterUserApplicationRequestDTO } from "../../dto/request/register-user-application-request-dto";
import { RegisterUserApplicationResponseDTO } from "../../dto/response/register-user-application-response-dto";


export class RegisterUserApplicationService extends IApplicationService 
<RegisterUserApplicationRequestDTO,RegisterUserApplicationResponseDTO> {

    execute(data: RegisterUserApplicationRequestDTO): Promise<Result<RegisterUserApplicationResponseDTO>> {
        throw new Error("Method not implemented.");
    }
    
}