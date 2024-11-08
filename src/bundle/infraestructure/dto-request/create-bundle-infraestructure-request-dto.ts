import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsDateString, IsNumber, IsPositive, IsString, MinLength } from "class-validator"

export class CreateBundleInfraestructureRequestDTO{

  
    @ApiProperty( { required: true, default: 'combo vegetariano' })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty( { required: true, default: '¡Descubre el delicioso Combo Vegetariano que tenemos para ti! Disfruta de lechuga con tomate.' })
    @IsString()
    @MinLength( 3 )
    description: string

    @ApiProperty( { required: true, default: '2024-11-06' })
    @IsDateString()
    caducityDate: Date

    @ApiProperty( { required: true, default: '50' })
    @IsNumber()
    @IsPositive()
    @Transform(({ value }) => {
        return Number(value);
      })
    stock: number

    @ApiProperty( { required: true, default: '5' })
    @IsNumber()
    @IsPositive()
    @Transform(({ value }) => {
        return Number(value);
      })
    price:number

    @ApiProperty( { required: true, default: 'usd' })
    @IsString()
    currency: string

    @ApiProperty( { required: true, default: '100' })
    @IsPositive()
    @Transform(({ value }) => {
      return Number(value);
    })
    weigth: number

    @ApiProperty( { required: true, default: 'kg' })
    @IsString()
    measurement: string

    @ApiProperty({required:true})
    @IsArray()
    @IsString({each: true})
    productId:string[]
}