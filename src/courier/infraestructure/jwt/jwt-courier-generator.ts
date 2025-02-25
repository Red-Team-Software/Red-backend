import { JwtService } from "@nestjs/jwt";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";

export class JwtCourierGenerator implements IJwtGenerator<string> {
    private readonly jwtService: JwtService
    constructor(jwt: JwtService) { 
        this.jwtService = jwt
    }
    
    generateJwt(param: string): string {
        return this.jwtService.sign( { id: param } )
    }
}