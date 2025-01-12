import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserInfraestructureResponseDTO {
    @ApiProperty({ example: '123123-12312312-123123' })
    id: string   

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9.aHVhbG9uZy5jaGlhbmdAZ21bacwuY29t.PhujWyxfi7WRJyPPryrf2IlPtkpEyQ6BXnFgXXWw0N8' })
    token: string
}