import { ApiProperty } from '@nestjs/swagger';

export class UseCuponInfraestructureResponseDTO {
  @ApiProperty()
  id: string;
  code: string;
  discount: number;
}
