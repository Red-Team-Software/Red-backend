import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";


export class CreateCourierEntryDTO{

    @ApiProperty( { required: true, default: 'Raul Alberto' })
    @IsString()
    @MinLength( 3 )
    name: string

}