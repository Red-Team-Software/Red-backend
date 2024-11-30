import { IServiceRequestDto } from "src/common/application/services";

export interface RegisterUserApplicationRequestDTO extends IServiceRequestDto{
    type: string;
    email: string    
    password: string  
    name: string  
    phone: string
}