import { Result } from "src/common/utils/result-handler/result";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { FindAllProductsApplicationRequestDTO } from "../dto/request/find-all-products-application-request-dto";

export interface IQueryProductRepository{
    findAllProducts(criteria:FindAllProductsApplicationRequestDTO):Promise<Result<Product[]>> 
}