import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordInfraestructureRequestDTO {
    
    @ApiProperty({ example: 'alfredo@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'elhechicero24' })
    @IsString()
    @MinLength(3)
    password: string
  
    @ApiProperty({ example: '0413' })
    @IsString()
    code: string

}