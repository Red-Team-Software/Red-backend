import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class ForgetPasswordInfraestructureRequestDTO {
    
    @ApiProperty({ example: 'alfredo@gmail.com' })
    @IsString()
    email: string

}