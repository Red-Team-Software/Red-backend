import { IServiceRequestDto } from 'src/common/application/services';

export interface LogInCourierApplicationRequestDTO extends IServiceRequestDto{
    email: string
    password: string  
}