import { BadRequestException } from "../domain/exceptions";
import { Result } from "./result-handler/result";

export function parseISODate(isoString: string): Result<Date> {
	try {
		const date = new Date(isoString);
		return Result.success<Date>(date);
	} catch (error) {
		return Result.fail<Date>(
			new BadRequestException(
				"Invalid date format, you must provide an ISO date"
			)
		);
	}
}
