import { IServiceResponseDto } from 'src/common/application/services';

//TODO API COMUN true pelado de response
export interface SaveCardApplicationResponseDTO extends IServiceResponseDto{
    success:boolean;
    message:string;
}