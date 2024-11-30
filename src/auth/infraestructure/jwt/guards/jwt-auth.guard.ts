import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { log } from "console"
import { ISession } from "src/auth/application/model/session.interface"
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { OrmTokenCommandRepository } from "../../repositories/orm-repository/orm-token-command-session-repository"
import { JwtPayloadInfraestructureDTO } from "../decorator/dto/jwt-payload-infraestructure-dto"
import { envs } from "src/config/envs/envs"
import { OrmTokenQueryRepository } from "../../repositories/orm-repository/orm-token-query-session-repository"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/Query-token-session-repository.interface"




@Injectable()
export class JwtAuthGuard implements CanActivate {

    private readonly sessionRepository: IQueryTokenSessionRepository<ISession>

    constructor(
        private jwtService: JwtService,
    ) {
        this.sessionRepository = new OrmTokenQueryRepository(PgDatabaseSingleton.getInstance())
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
            log(sessionData)
            request.user = sessionData; // Añade el usuario decodificado a la solicitud
            request['session'] = sessionData
        } catch (e) {
            console.log(e)
             throw new UnauthorizedException(`Error durig getting the token with name:${e.name}, message:${e.message}`)
        }
        return true
    }
    
    private async validate(payload: JwtPayloadInfraestructureDTO) {
        const session = await this.sessionRepository.findSessionById( payload.id ); 
        if ( !session.isSuccess() ) 
            throw new NotFoundException('session id not foud')
        return session.getValue;
    }
}