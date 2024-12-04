import { ApiProperty } from '@nestjs/swagger';

class ProductInfraestructureDTO {
    @ApiProperty({ example: '09f75297-30b1-4aa6-bed1-f6320f0b4bd0' })
    id: string;

    @ApiProperty({ example: 'Product Name' })
    name: string;
}

class BundleInfraestructureDTO {
    @ApiProperty({ example: '09f75297-30b1-4aa6-bed1-f6320f0b4bd0' })
    id: string;

    @ApiProperty({ example: 'Bundle Name' })
    name: string;
}

class CategoryInfraestructureDTO {
    @ApiProperty({ example: '09f75297-30b1-4aa6-bed1-f6320f0b4bd0' })
    id: string;

    @ApiProperty({ example: 'Category Name' })
    name: string;
}

export class FindPromotionByIdInfraestructureResponseDTO {
    @ApiProperty({ example: '09f75297-30b1-4aa6-bed1-f6320f0b4bd0' })
    id: string;

    @ApiProperty({ required: true, default: 'Promocion de navidad 2025 sobre los productos navideños' })
    description: string;

    @ApiProperty({ example: 'Promocion de navidad 2025' })
    name: string;
    
    @ApiProperty({ example: true })
    avaleableState: boolean;

    @ApiProperty({ example: 0.5 })
    discount: number;
  
    @ApiProperty({ type: [ProductInfraestructureDTO] })
    products: ProductInfraestructureDTO[];

    @ApiProperty({ type: [BundleInfraestructureDTO] })
    bundles: BundleInfraestructureDTO[];

    @ApiProperty({ type: [CategoryInfraestructureDTO] })
    categories: CategoryInfraestructureDTO[];
}
