import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "src/user/domain/value-object/enum/user.roles";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { UnauthorizedException } from "src/common/infraestructure/infraestructure-exception/unauthorized/unauthorized.exception";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        const result = requiredRoles.some((role) => user.role?.includes(role));

        if (!result) 
            throw new UnauthorizedException('Privileges not enogh');

        return result;
    }
}