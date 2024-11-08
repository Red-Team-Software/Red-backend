import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InfraesctructureException } from "../infraestructure-exception";
import { ExeptionInfraestructureType } from "../infraestructure-exception/enum/exceptions-infraestructure-type.enums";
import { BaseException } from "src/common/utils/base-exception";
import { BaseExceptionEnum } from "src/common/utils/enum/base-exception.enum";

export class ExceptionMapper {
	private constructor() {}

	private static handleDomainException(error:BaseException,message:string):void{
		throw new BadRequestException(message)
	}
	private static handleApplicationException(error:BaseException,message:string):void{

		throw new BadRequestException(message)
	}
	private static handleInfraestructureException(error:BaseException,message:string):void{
		if (error instanceof InfraesctructureException){
			switch (error.getInfraestructureType()) {
				case ExeptionInfraestructureType.BAD_REQUEST:
					throw new BadRequestException(message)
				case ExeptionInfraestructureType.CONFLICT:
					throw new ConflictException(message);
				case ExeptionInfraestructureType.NOT_FOUND:
					throw new NotFoundException(message);
				case ExeptionInfraestructureType.PERSISTENCE:
					throw new InternalServerErrorException( message);
				case ExeptionInfraestructureType.UNAUTHORIZED:
					throw new UnauthorizedException(message);
				default:
					throw new InternalServerErrorException("Unesxpected Infraestrcuture Error not handeled");
			}
		}
		throw new InternalServerErrorException("Unexpected Infraestructure error");
	}
	static toHttp(error: BaseException, message:string): void{
			if (error.Type==BaseExceptionEnum.APPLICATION_EXCEPTION)
				this.handleApplicationException(error,message)
			if (error.Type==BaseExceptionEnum.DOMAIN_EXCEPTION)
				this.handleDomainException(error,message)
			if (error.Type==BaseExceptionEnum.INFRAESTRUCTURE_EXCEPTION)
				this.handleInfraestructureException(error,message)
			throw new InternalServerErrorException("Unexpected error");	
	}
}
