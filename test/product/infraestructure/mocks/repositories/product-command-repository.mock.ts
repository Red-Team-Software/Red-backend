
import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ICommandProductRepository } from "src/product/domain/repository/product.command.repositry.interface";
import { ProductID } from "src/product/domain/value-object/product-id";


export class ProductCommadRepositoryMock implements ICommandProductRepository{

    constructor(private products: Product[] = []){}

    async createProduct(product: Product): Promise<Result<Product>> {
        this.products.push(product)
        return Result.success(product)   
    }
    async deleteProductById(id: ProductID): Promise<Result<ProductID>> {
        this.products = this.products.filter((p) => p.getId().equals(id))
        return Result.success(id)
    }
    async updateProduct(product: Product): Promise<Result<Product>> {
        this.products = this.products.filter((p) => p.getId().equals(product.getId()))
        this.products.push(product)
        return Result.success(product)
    }
}