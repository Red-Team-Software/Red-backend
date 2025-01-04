import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsString, MinLength, IsDateString, IsOptional, IsNumber, IsPositive, IsUUID, IsArray } from "class-validator"

export class UpdateBundleInfraestructureRequestDTO{
      
        @ApiProperty( { required: false, default: 'combo vegetariano' })
        @IsString()
        @MinLength( 3 )
        @IsOptional()
        name: string
    
        @ApiProperty( { required: false, default: 'Disfruta de nuestro combo vegetariano, una selección deliciosa y saludable de productos frescos y nutritivos. Este combo incluye una variedad de vegetales orgánicos, como lechuga, tomate, zanahoria, y pepino, perfectos para preparar ensaladas o acompañar tus platos favoritos. Además, hemos añadido una porción de hummus casero y pan integral para complementar tu comida. Ideal para quienes buscan una opción balanceada y llena de sabor' })
        @IsString()
        @MinLength( 3 )
        @IsOptional()
        description: string

        @ApiProperty( { required: false, default: '10' })
        @IsNumber()
        @IsPositive()
        @Transform(({ value }) => {
            return Number(value);
          })
        @IsOptional()
        price:number

        @ApiProperty( { required: false, default: 'usd' })
        @IsString()
        @IsOptional()
        currency: string

        @ApiProperty( { required: false, default: 1 })
        @IsPositive()
        @Transform(({ value }) => {
          return Number(value);
        })
        @IsOptional()
        weigth: number
    
        @ApiProperty( { required: false, default: 'kg' })
        @IsString()
        @IsOptional()
        measurement: string

        @ApiProperty( { required: false, default: '20' })
        @IsNumber()
        @IsPositive()
        @Transform(({ value }) => {
            return Number(value);
          })
        @IsOptional()
        stock: number

        @ApiProperty({required:false})
        @IsArray()
        @IsString({each: true})
        @IsUUID('4', { each: true })
        @IsOptional()
        productId:string[]
    
        @ApiProperty( { required: false, default: '2025-04-13' })
        @IsDateString()
        @IsOptional()
        caducityDate: Date
}