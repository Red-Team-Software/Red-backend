import { IApplicationService } from "src/common/application/services";
import { ChangePasswordApplicationRequestDTO } from "../../dto/request/change-password-application-request-dto";
import { ChangePasswordApplicationResponseDTO } from "../../dto/response/change-password-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";

export class ChangePasswordApplicationService extends IApplicationService 
<ChangePasswordApplicationRequestDTO,ChangePasswordApplicationResponseDTO> {

    execute(data: ChangePasswordApplicationRequestDTO): Promise<Result<ChangePasswordApplicationResponseDTO>> {
        throw new Error("Method not implemented.");
    }
    
}