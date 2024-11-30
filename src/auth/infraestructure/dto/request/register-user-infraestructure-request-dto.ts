import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterUserInfraestructureRequestDTO {
    
    @ApiProperty( { required: true, default: 'CLIENT' })
    @IsString()
    @IsIn(['CLIENT', 'ADMIN'])
    @IsOptional()
    type: string;

    @ApiProperty({ example: 'alfredo@gmail.com' })
    @IsString()
    email: string
    
    @ApiProperty({ example: 'elhechicero24' })
    @IsString()
    password: string
  
    @ApiProperty({ example: 'Alfredo' })
    @IsString()
    name: string
  
    @ApiProperty({ example: '04121234567' })
    @IsString()
    phone: string

}