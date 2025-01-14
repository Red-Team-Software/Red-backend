
import { ISession } from "src/auth/application/model/session.interface"
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { envs } from "src/config/envs/envs"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/query-token-session-repository.interface"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { IAccount } from "src/auth/application/model/account.interface"
import { ICredential } from "src/auth/application/model/credential.interface"
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { OrmUserQueryRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-query-repository"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { CourierQueryRepository } from "../../repository/orm-repository/orm-courier-query-repository"
import { ICourierQueryRepository } from "src/courier/application/query-repository/courier-query-repository-interface"
import { CourierId } from "src/courier/domain/value-objects/courier-id"
import { JwtPayloadInfraestructureDTO } from "src/auth/infraestructure/jwt/decorator/dto/jwt-payload-infraestructure-dto"
import { ICourierModel } from "src/courier/application/model/courier-model-interface"




@Injectable()
export class JwtAuthGuard implements CanActivate {

    private readonly courierRepository: ICourierQueryRepository

    constructor(
        private jwtService: JwtService,
    ) {
        this.courierRepository=new CourierQueryRepository(PgDatabaseSingleton.getInstance())
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request = context.switchToHttp().getRequest()   

        if ( !request.headers['authorization'] ) 
            throw new UnauthorizedException(`Error doesnt have authorization into the petition to the server inside the header`) 

        const [type, token] = request.headers['authorization'].split(' ') ?? []

        if ( type != 'Bearer' || !token ) 
            throw new UnauthorizedException(`Error doesnt have bearer into the petition to the server inside the header`)                       

        try {
            const payload = await this.jwtService.verifyAsync( token, { secret: envs.JWT_SECRET_KEY } )
            const sessionData = await this.validate( payload )
            request.credential = sessionData
        } catch (e) {
            throw new UnauthorizedException(`Error durig getting the token with name:${e.name}, message:${e.message}`)
        }
        return true
    }
    
    private async validate(payload: JwtPayloadInfraestructureDTO):Promise<ICourierModel>{
        const courier= await this.courierRepository.findCourierById(CourierId.create(payload.id))

        if (!courier.isSuccess())
            throw new NotFoundException('user id not found')
        
        let credential:ICourierModel={
            courierId: courier.getValue.getId().courierId,
            courierName: courier.getValue.CourierName.courierName,
            courierImage: courier.getValue.CourierImage.Value,
            courierDirection: {
                lat: courier.getValue.CourierDirection.Latitude,
                long: courier.getValue.CourierDirection.Longitude
            }
        }
        return credential
    }
}