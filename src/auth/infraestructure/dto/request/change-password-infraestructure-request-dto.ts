import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class ChangePasswordInfraestructureRequestDTO {
    
    @ApiProperty({ example: 'alfredo@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'elhechicero24' })
    @IsString()
    password: string
  
    @ApiProperty({ example: '0413' })
    @IsString()
    code: string

}