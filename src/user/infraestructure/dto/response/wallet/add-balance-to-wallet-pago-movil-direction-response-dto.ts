import { ApiProperty } from "@nestjs/swagger";

export class AddBalanceZelleResponseDTO {
    
    @ApiProperty()
    success:boolean;
    @ApiProperty()
    message:string;
}