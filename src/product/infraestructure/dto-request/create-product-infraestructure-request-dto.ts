import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsBase64, isBase64, IsDate, IsDateString, IsNegative, IsNumber, isPositive, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductInfraestructureRequestDTO{

    @IsString()
    @MinLength( 3 )
    name: string
    @IsString()
    @MinLength( 3 )
    description: string
    @IsDateString()
    caducityDate: Date

    @IsNumber()
    @IsPositive()
    @Transform(({ value }) => {
        return Number(value);
      })
    stock: number

    @IsNumber()
    @IsPositive()
    @Transform(({ value }) => {
        return Number(value);
      })
    price:number

}