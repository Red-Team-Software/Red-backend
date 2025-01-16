import { Result } from "src/common/utils/result-handler/result"
import { Product } from "../aggregate/product.aggregate"
import { ProductID } from "../value-object/product-id"


export interface ICommandProductRepository {
    createProduct( product: Product ): Promise<Result<Product>>
    deleteProductById( id: ProductID ): Promise<Result<ProductID>> 
    updateProduct( product: Product ): Promise<Result<Product>>
}