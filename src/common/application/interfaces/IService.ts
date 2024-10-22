import { Result } from "src/common/utils/result-handler/result";

export abstract class IService<
	I extends IServiceRequestDto,
	O extends IServiceResponseDto,
> {
	get name() {
		return this.constructor.name;
	}

	abstract execute(command: I): Promise<Result<O>>; //Acción singular que realiza el servicio
}

//Por cosas de como funciona el logging en TS, hace falta que los DTO de petición y respuesta implementen una interfaz
export interface IServiceRequestDto {
	dataToString(): string; //Esto debería devolver un string con los datos formateados para loggear
}

export interface IServiceResponseDto {
	dataToString(): string; //Esto debería devolver un string con los datos formateados para loggear
}
