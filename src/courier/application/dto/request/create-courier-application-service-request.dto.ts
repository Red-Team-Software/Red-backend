import { IServiceRequestDto } from "src/common/application/services";


export interface CreateCourierApplicationServiceRequestDto extends IServiceRequestDto {
    userId: string;
    lat: number;
    long: number;
    name: string;
    email: string;
    password: string;
    image: Buffer;
}