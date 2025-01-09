import { IServiceResponseDto } from 'src/common/application/services';


export interface SaveCardApplicationResponseDTO extends IServiceResponseDto{
    success:boolean;
    message:string;
}