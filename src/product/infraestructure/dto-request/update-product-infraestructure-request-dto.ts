import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsString, MinLength, IsDateString, IsOptional, IsNumber, IsPositive } from "class-validator"

export class UpdateProductInfraestructureRequestDTO{
      
        @ApiProperty( { required: false, default: 'lechuga' })
        @IsString()
        @MinLength( 3 )
        @IsOptional()
        name: string
    
        @ApiProperty( { required: false, default: 'Lactuca sativa o lechuga como es llamada popularmente, es una hortaliza apreciada globalmente por su composición nutritiva y las diferentes ventajas que genera su consumo a la salud del hombre. Es una herbácea anual, originaria de Asia y el Mediterráneo, cuya domesticación data alrededor de los 4500 a.C. Se consume en fresco, para la preparación de diferentes ensaladas, pero también se ha reportado que se aprovechan sus extractos en perfumería y para la obtención de un compuesto somnífero y relajador, el lactucarium.' })
        @IsString()
        @MinLength( 3 )
        @IsOptional()
        description: string
    
        @ApiProperty( { required: false, default: '2024-11-06' })
        @IsDateString()
        @IsOptional()
        caducityDate: Date
    
        @ApiProperty( { required: false, default: '50' })
        @IsNumber()
        @IsPositive()
        @Transform(({ value }) => {
            return Number(value);
          })
        @IsOptional()
        stock: number
    
        @ApiProperty( { required: true, default: '5' })
        @IsNumber()
        @IsPositive()
        @Transform(({ value }) => {
            return Number(value);
          })
        @IsOptional()
        price:number
    
        @ApiProperty( { required: true, default: 'usd' })
        @IsString()
        @IsOptional()
        currency: string
    
        @ApiProperty( { required: true, default: '100' })
        @IsPositive()
        @Transform(({ value }) => {
          return Number(value);
        })
        @IsOptional()
        weigth: number
    
        @ApiProperty( { required: true, default: 'kg' })
        @IsString()
        @IsOptional()
        measurement: string
}