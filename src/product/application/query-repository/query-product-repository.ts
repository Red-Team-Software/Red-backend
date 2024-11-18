import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { FindAllProductsApplicationRequestDTO } from "../dto/request/find-all-products-application-request-dto";
import { FindAllProductsbyNameApplicationRequestDTO } from "../dto/request/find-all-products-and-combos-request-dto";
import { ProductID } from "src/product/domain/value-object/product-id";

export interface IQueryProductRepository{
    findAllProducts(criteria:FindAllProductsApplicationRequestDTO):Promise<Result<Product[]>> 
    findAllProductsByName(criteria:FindAllProductsbyNameApplicationRequestDTO):Promise<Result<Product[]>>
}