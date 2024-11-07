import { HttpException, HttpStatus } from "@nestjs/common";
import { log } from "console";
import { ExeptionType, InfraesctructureException } from "../exceptions";

export class ExceptionMapper {
	private constructor() {}

	static toHttp(error: Error) {
		log(error)
		try {
			if (error instanceof InfraesctructureException) {
				switch (error.getType()) {
					case ExeptionType.BAD_REQUEST:
						return new HttpException(error.message, HttpStatus.BAD_REQUEST);
					case ExeptionType.CONFLICT:
						return new HttpException(error.message, HttpStatus.CONFLICT);
					case ExeptionType.NOT_FOUND:
						return new HttpException(error.message, HttpStatus.NOT_FOUND);
					case ExeptionType.PERSISTENCE:
						return new HttpException(
							error.message,
							HttpStatus.INTERNAL_SERVER_ERROR
						);
					case ExeptionType.UNAUTHORIZED:
						return new HttpException(error.message, HttpStatus.UNAUTHORIZED);
					case ExeptionType.DOMAIN_VALIDATION:
						return new HttpException(error.message, HttpStatus.BAD_REQUEST);
					default:
						return new HttpException(
							"Error not handeled",
							HttpStatus.NOT_IMPLEMENTED
						);
				}
			} else {
				return new HttpException(
					"Error not handeled " + error,
					HttpStatus.NOT_IMPLEMENTED
				);
			}
		} catch (error) {
			return new HttpException(
				"Error not handeled and captured" + error,
				HttpStatus.NOT_IMPLEMENTED
			);
		}
	}
}
