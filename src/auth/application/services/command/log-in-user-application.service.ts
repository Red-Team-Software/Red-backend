import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { LogInUserApplicationRequestDTO } from "../../dto/request/log-in-user-application-request-dto";
import { LogInUserApplicationResponseDTO } from "../../dto/response/log-in-user-application-response-dto";

export class LogInUserApplicationService extends IApplicationService 
<LogInUserApplicationRequestDTO,LogInUserApplicationResponseDTO> {

    constructor(){
        super()
    }

    execute(data: LogInUserApplicationRequestDTO): Promise<Result<LogInUserApplicationResponseDTO>> {
        throw new Error("Method not implemented.");
    }

}