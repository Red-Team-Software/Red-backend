import { Injectable, CanActivate, ExecutionContext, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { UnauthorizedException } from "src/common/infraestructure/infraestructure-exception/unauthorized/unauthorized.exception";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { OrmUserQueryRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-query-repository";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";
import { ICredential } from "src/auth/application/model/credential.interface";
import { UserId } from "src/user/domain/value-object/user-id";


@Injectable()
export class RolesGuard implements CanActivate {

    private readonly userQueryRepository: IQueryUserRepository

    constructor(private reflector: Reflector) { 
        this.userQueryRepository = new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
    }

    private async getUserRole(credential:ICredential):Promise<string>{
        const user = await this.userQueryRepository.findUserById(UserId.create(credential.account.idUser)); 
        if ( !user.isSuccess() ) 
            throw new NotFoundException('user id not foud')
        return user.getValue.UserRole.Value
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
    
            if (!requiredRoles) 
                return true;
    
            const { request } = context.switchToHttp().getRequest();

            //TODO sale como undefined
            console.log(request)
    
            const roles=await this.getUserRole(request.credential)
    
            const result = requiredRoles.some((role) => request.credential.role?.includes(role));
    
            if (!result) 
                throw new UnauthorizedException('Privileges not enogh');
    
            return result;
        }catch(e){
            throw new UnauthorizedException(`Error durig getting the user role with name:${e.name}, message:${e.message}`)

        }
    }
}