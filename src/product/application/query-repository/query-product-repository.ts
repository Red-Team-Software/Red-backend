import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { FindAllProductsApplicationRequestDTO } from "../dto/request/find-all-products-application-request-dto";
import { FindAllProductsbyNameApplicationRequestDTO } from "../dto/request/find-all-products-and-combos-application-request-dto";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductName } from "src/product/domain/value-object/product-name";
import { IProductModel } from "../model/product.model.interface";

export interface IQueryProductRepository{
    findAllProducts(criteria:FindAllProductsApplicationRequestDTO):Promise<Result<IProductModel[]>> 
    findAllProductsByName(criteria:FindAllProductsbyNameApplicationRequestDTO):Promise<Result<Product[]>>
    findProductById( id: ProductID ): Promise<Result<Product>>
    findProductWithMoreDetailById( id: ProductID ): Promise<Result<IProductModel>>
    findProductByName(productName: ProductName): Promise<Result<Product[]>>
    verifyProductExistenceByName(productName: ProductName): Promise<Result<boolean>> 
}