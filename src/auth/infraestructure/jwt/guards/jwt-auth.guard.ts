
import { ISession } from "src/auth/application/model/session.interface"
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { OrmTokenCommandRepository } from "../../repositories/orm-repository/orm-token-command-session-repository"
import { JwtPayloadInfraestructureDTO } from "../decorator/dto/jwt-payload-infraestructure-dto"
import { envs } from "src/config/envs/envs"
import { OrmTokenQueryRepository } from "../../repositories/orm-repository/orm-token-query-session-repository"
import { IQueryTokenSessionRepository } from "src/auth/application/repository/query-token-session-repository.interface"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { IAccount } from "src/auth/application/model/account.interface"
import { ICredential } from "src/auth/application/model/credential.interface"
import { OrmAccountQueryRepository } from "../../repositories/orm-repository/orm-account-query-repository"
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { OrmUserQueryRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-query-repository"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"




@Injectable()
export class JwtAuthGuard implements CanActivate {

    private readonly sessionRepository: IQueryTokenSessionRepository<ISession>
    private readonly accountRepository: IQueryAccountRepository<IAccount>
    private readonly userRepository: IQueryUserRepository


    constructor(
        private jwtService: JwtService,
    ) {
        this.sessionRepository = new OrmTokenQueryRepository(PgDatabaseSingleton.getInstance())
        this.accountRepository= new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance())
        this.userRepository=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
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
    
    private async validate(payload: JwtPayloadInfraestructureDTO):Promise<ICredential>{
        const session = await this.sessionRepository.findSessionById( payload.id ); 
        if ( !session.isSuccess() ) 
            throw new NotFoundException('session id not foud')

        const account = await this.accountRepository.findAccountById(session.getValue.accountId) 
        if ( !account.isSuccess() ) 
            throw new NotFoundException('account id not found')

        const user= await this.userRepository.findUserById(UserId.create(account.getValue.idUser))

        if (!user.isSuccess())
            throw new NotFoundException('user id not found')
        
        let credential:ICredential={
            account:account.getValue,
            session:session.getValue,
            userRole:user.getValue.UserRole.Value as UserRoles
        }
        return credential
    }
}