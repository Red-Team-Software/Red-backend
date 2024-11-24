import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CancelOrderDto {
    @ApiProperty({ description: 'order id' })
    @IsString()
    orderId: string;
}