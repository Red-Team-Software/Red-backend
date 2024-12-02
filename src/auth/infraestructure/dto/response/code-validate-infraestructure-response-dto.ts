import { ApiProperty } from '@nestjs/swagger'

export class CodeValidateInfraestructureResponseDTO {
    
    @ApiProperty({ example: '0413' })
    code: string
    @ApiProperty({ example: true })
    validate: boolean
  
}