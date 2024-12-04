import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { Transform } from "class-transformer";


export class ModifyCourierLocationEntryDto {
    
    @ApiProperty({ example: '2128865d-15af-4e61-a6f9-062ff3881e22',description: 'order id' })
    @IsString()
    orderId: string;
    
    @ApiProperty( { example: '2128865d-15af-4e61-a6f9-062ff3881e22', required: true })
    @IsNumber()
    lat: number;

    @ApiProperty( { example: '2128865d-15af-4e61-a6f9-062ff3881e22', required: true })
    @IsNumber()
    long: number;


}