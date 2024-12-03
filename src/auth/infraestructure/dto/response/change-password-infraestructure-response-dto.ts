import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordInfraestructureResponseDTO {
    
    @ApiProperty({ example: '123123-12312312-123123' })
    id: string

}