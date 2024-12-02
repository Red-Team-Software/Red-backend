import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class CodeValidateInfraestructureRequestDTO {
    
    @ApiProperty({ example: 'alfredo@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: '0413' })
    @IsString()
    code: string
  
}