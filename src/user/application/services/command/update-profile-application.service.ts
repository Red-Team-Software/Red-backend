import { IApplicationService } from "src/common/application/services";
import { UpdateProfileApplicationRequestDTO } from "../../dto/request/update-profile-application-request-dto";
import { UpdateProfileApplicationResponseDTO } from "../../dto/response/update-profile-application-response-dto";
import { Result } from "src/common/utils/result-handler/result";

export class UpdateProfileApplicationService extends IApplicationService 
<UpdateProfileApplicationRequestDTO,UpdateProfileApplicationResponseDTO> {
    
    execute(data: UpdateProfileApplicationRequestDTO): Promise<Result<UpdateProfileApplicationResponseDTO>> {
        throw new Error("Method not implemented.");
    }

}
