import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SaveTokenInfraestructureEntryDTO{
    @ApiProperty( { required: true, 
        default: 'BOd11oXPOIGOWuxvNaLH7FxSlER3T5piVYS6rpRrrKIx3Gx60LhMnRrBbI-5om8xe55Cjf1ROZHDQfQuIMegiYQ' })
    @IsString()
    token:string
}