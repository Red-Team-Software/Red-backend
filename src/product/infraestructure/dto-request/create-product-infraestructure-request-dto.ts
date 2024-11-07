import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsBase64, isBase64, IsDate, IsDateString, IsNegative, IsNumber, isPositive, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductInfraestructureRequestDTO{

    @ApiProperty( { required: true, default: 'lechuga' })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty( { required: true, default: 'Lactuca sativa o lechuga como es llamada popularmente, es una hortaliza apreciada globalmente por su composición nutritiva y las diferentes ventajas que genera su consumo a la salud del hombre. Es una herbácea anual, originaria de Asia y el Mediterráneo, cuya domesticación data alrededor de los 4500 a.C. Se consume en fresco, para la preparación de diferentes ensaladas, pero también se ha reportado que se aprovechan sus extractos en perfumería y para la obtención de un compuesto somnífero y relajador, el lactucarium.' })
    @IsString()
    @MinLength( 3 )
    description: string

    @ApiProperty( { required: true, default: '2024-11-6' })
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

    // @ApiProperty( { required: true, default: 'usd' })
    // @IsString()
    // @MinLength( 3 )
    // currency: string
}