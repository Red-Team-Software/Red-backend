import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class payOrder {
    @ApiProperty({ example: '50' })
    @IsNumber()
    am: number;

    @ApiProperty({ example: 'USD' })
    @IsString()
    currency: string;

    @ApiProperty({ example: 'VES' })
    @IsString()
    currency2: string;
}