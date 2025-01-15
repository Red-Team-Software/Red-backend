import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class LogInCourierInfraestructureRequestDTO {
    
    @ApiProperty({ example: 'gadeso2003@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'password' })
    @IsString()
    password: string
  
}