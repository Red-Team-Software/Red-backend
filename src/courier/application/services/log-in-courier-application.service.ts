import { IApplicationService } from "src/common/application/services";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { Result } from "src/common/utils/result-handler/result";
import { LogInCourierApplicationRequestDTO } from "../dto/request/log-in-courier-application-request-dto";
import { LogInCourierApplicationResponseDTO } from "../dto/response/log-in-courier-application-response-dto";
import { ICourierQueryRepository } from "../repository/query-repository/courier-query-repository-interface";
import { NotFoundCourierApplicationException } from "../application-exceptions/not-found-courier-application.exception";
import { InvalidCourierPasswordApplicationException } from "../application-exceptions/invalid-courier-password-application-exception";

export class LogInCourierApplicationService extends IApplicationService 
<LogInCourierApplicationRequestDTO,LogInCourierApplicationResponseDTO> {

    constructor(
        private readonly courierQueryRepository: ICourierQueryRepository,
        private readonly encryptor: IEncryptor,
        private readonly jwtGen:IJwtGenerator<string>
    ){
        super()
    }

    async execute(data: LogInCourierApplicationRequestDTO): Promise<Result<LogInCourierApplicationResponseDTO>> {

        let result = await this.courierQueryRepository.findCourierByEmailDetail(data.email)

        if (!result.isSuccess())
            return Result.fail(new NotFoundCourierApplicationException())

        let courier = result.getValue;

        const validPassword = await this.encryptor.comparePlaneAndHash( data.password, courier.password )
        
        if ( !validPassword ) 
            return Result.fail(new InvalidCourierPasswordApplicationException())

        const jwt = this.jwtGen.generateJwt( courier.courierId )

        return Result.success({
            id: courier.courierId,
            email: courier.email,
            name: courier.courierName,
            token: jwt
        })

    }

}