import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FindOrderByIdEntryDto {
    @ApiProperty({ example: '2128865d-15af-4e61-a6f9-062ff3881e22',description: 'order id' })
    @IsString()
    orderId: string;
}