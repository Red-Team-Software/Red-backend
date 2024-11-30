import { IApplicationService } from "src/common/application/services";
import { ForgetPasswordApplicationRequestDTO } from "../../dto/request/Forget-password-application-request-dto";
import { ForgetPasswordApplicationResponseDTO } from "../../dto/response/Forget-password-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";

export class ForgetPasswordApplicationService extends IApplicationService 
<ForgetPasswordApplicationRequestDTO,ForgetPasswordApplicationResponseDTO> {

    execute(data: ForgetPasswordApplicationRequestDTO): Promise<Result<ForgetPasswordApplicationResponseDTO>> {
        throw new Error("Method not implemented.");
    }
    
}