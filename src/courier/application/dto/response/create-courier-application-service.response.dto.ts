import { IServiceResponseDto } from "src/common/application/services";


export interface CreateCourierApplicationServiceResponseDto extends IServiceResponseDto {
    name: string;
    image: string;
    token: string;
}