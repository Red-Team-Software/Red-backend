import { Result } from "src/common/utils/result-handler/result"
import { Product } from "../aggregate/product.aggregate"
import { ProductID } from "../value-object/product-id"
import { ProductName } from "../value-object/product-name"


export interface ICommandProductRepository {
    createProduct( product: Product ): Promise<Result<Product>>
    deleteProductById( id: ProductID ): Promise<Result<ProductID>> 
    updateProduct( product: Product ): Promise<Result<Product>>
    // addCategoryToProduct(category:ProductCategory,id:ProductId):Promise<Result<Product>>
    // deleteCategoryIntoProduct(category:ProductCategory,ProductId:ProductId):Promise<Result<Product>>
}