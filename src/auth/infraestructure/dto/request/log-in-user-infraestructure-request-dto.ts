import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class LogInUserInfraestructureRequestDTO {
    
    @ApiProperty({ example: 'alfredo@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'elhechicero24' })
    @IsString()
    password: string
  
}