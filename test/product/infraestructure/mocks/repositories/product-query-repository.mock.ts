import { NotFoundException } from "src/common/infraestructure/infraestructure-exception";
import { Result } from "src/common/utils/result-handler/result";
import { FindAllProductsbyNameApplicationRequestDTO } from "src/product/application/dto/request/find-all-products-and-combos-application-request-dto";
import { FindAllProductsApplicationRequestDTO } from "src/product/application/dto/request/find-all-products-application-request-dto";
import { IProductModel } from "src/product/application/model/product.model.interface";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { Product } from "src/product/domain/aggregate/product.aggregate";
import { ProductID } from "src/product/domain/value-object/product-id";
import { ProductName } from "src/product/domain/value-object/product-name";

export class ProductQueryRepositoryMock implements IQueryProductRepository{

    constructor(private products: Product[] = []){}

        private trasnformtoDataModel(ormProduct:Product):IProductModel{
            return {
                id:ormProduct.getId().Value,
                description:ormProduct.ProductDescription.Value,
                caducityDate:
                ormProduct.ProductCaducityDate
                ? ormProduct.ProductCaducityDate.Value
                : null,	
                name:ormProduct.ProductName.Value,
                stock:ormProduct.ProductStock.Value,
                images:ormProduct.ProductImages.map(image=>image.Value),
                price:Number(ormProduct.ProductPrice.Price),
                currency:ormProduct.ProductPrice.Currency,
                weigth:ormProduct.ProductWeigth.Weigth,
                measurement:ormProduct.ProductWeigth.Measure,
                categories: [],
                promotion:[]
            }
        }

    async findAllProducts(criteria: FindAllProductsApplicationRequestDTO): Promise<Result<IProductModel[]>> {
        let products= this.products.slice(criteria.page,criteria.perPage)
        return Result.success(products.map((p) => this.trasnformtoDataModel(p)))
    }

    async findAllProductsByName(criteria: FindAllProductsbyNameApplicationRequestDTO): Promise<Result<Product[]>> {
        let products= this.products.filter((p) => p.ProductName.Value.includes(criteria.name))
        products= products.slice(criteria.page,criteria.perPage)
        return Result.success(products)
    }

    async findProductById(id: ProductID): Promise<Result<Product>> {
        let product=this.products.find((p) => p.getId().equals(id))
        if (!product)
            return Result.fail(new NotFoundException('Find product by id unsucssessfully'))
        return Result.success(product)
    }

    async findProductWithMoreDetailById(id: ProductID): Promise<Result<IProductModel>> {
        let product=this.products.find((p) => p.getId().equals(id))
        if (!product)
            return Result.fail(new NotFoundException('Find product by id unsucssessfully'))
        return Result.success(this.trasnformtoDataModel(product))    }
    
    async findProductByName(productName: ProductName): Promise<Result<Product[]>> {
        let product=this.products.filter((p) => p.ProductName.equals(productName))
        if (!product)
            return Result.fail(new NotFoundException('Find product by name unsucssessfully'))
        return Result.success(product)
    }
    async verifyProductExistenceByName(productName: ProductName): Promise<Result<boolean>> {
        let product=this.products.find((p) => p.ProductName.equals(productName))
        if (!product)
            return Result.success(false)
        return Result.success(true)
    }
}