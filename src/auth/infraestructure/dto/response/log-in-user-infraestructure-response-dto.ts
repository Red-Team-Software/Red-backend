import { ApiProperty } from '@nestjs/swagger'

export class LogInUserInfraestructureResponseDTO {
    
    @ApiProperty({ example: '123242-123123-123123-12312312' })
    id: string;

    @ApiProperty({ example: 'alfredo@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Alfredo' })
    name: string;

    @ApiProperty({ example: '04121234567' })
    phone: string;
    
    @ApiProperty({ example: 'CLIENT' })
    type: string
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9.aHVhbG9uZy5jaGlhbmdAZ21bacwuY29t.PhujWyxfi7WRJyPPryrf2IlPtkpEyQ6BXnFgXXWw0N8' })
    token: string
  
}