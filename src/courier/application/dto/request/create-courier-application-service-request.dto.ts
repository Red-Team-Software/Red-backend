import { IServiceRequestDto } from "src/common/application/services";


export interface CreateCourierApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    
    name: string;
    image: Buffer;
}