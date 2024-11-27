import { IApplicationService } from "src/common/application/services";
import { Result } from "src/common/utils/result-handler/result";
import { CodeValidateApplicationRequestDTO } from "../../dto/request/code-validate-application-request-dto";
import { CodeValidateApplicationResponseDTO } from "../../dto/response/code-validate-application-response-dto";


export class CodeValidateApplicationService extends IApplicationService 
<CodeValidateApplicationRequestDTO,CodeValidateApplicationResponseDTO> {

    execute(data: CodeValidateApplicationRequestDTO): Promise<Result<CodeValidateApplicationResponseDTO>> {
        throw new Error("Method not implemented.");
    }
    
}