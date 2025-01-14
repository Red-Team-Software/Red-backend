import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength, IsNumber, IsPositive, IsEnum } from "class-validator"
import { CouponStateEnum } from "src/cupon/domain/value-object/enum/coupon.state.enum"

export class CreateCuponInfraestructureRequestDTO{

  
    @ApiProperty( { required: true, default: 'Dulce' })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty( { required: true, default: 'codigo1' })
    @IsString()
    @MinLength( 3 )
    code: string

    @ApiProperty( { required: true, default: 0.1 })
    @IsNumber()
    @IsPositive()
    discount: number

    @ApiProperty({ enum: CouponStateEnum, required: true, default: CouponStateEnum.avaleable })
    @IsEnum(CouponStateEnum)
    state: string

}