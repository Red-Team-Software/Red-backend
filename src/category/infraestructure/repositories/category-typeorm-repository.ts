import { ICategoryRepository } from "src/category/domain/repository/category-repository.interface";
import { DataSource, Repository } from "typeorm";
import { OrmCategoryEntity } from "../entities/orm-entities/orm-category-entity";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "src/category/application/application-exception/not-found-category-application-exception";
import { OrmCategoryMapper } from "../mapper/orm-category-mapper";
import { OrmCategoryImage } from "../entities/orm-entities/orm-category-image.entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { Product } from "src/product/domain/aggregate/product.aggregate";

export class OrmCategoryRepository extends Repository<OrmCategoryEntity> implements ICategoryRepository {
    private mapper: IMapper<Category, OrmCategoryEntity>;
    private readonly ormCategoryImageRepository: Repository<OrmCategoryImage>;

    constructor(dataSource: DataSource) {
        super(OrmCategoryEntity, dataSource.createEntityManager());
        this.mapper = new OrmCategoryMapper(new UuidGen(),dataSource);
        this.ormCategoryImageRepository = dataSource.getRepository(OrmCategoryImage);
    }
    agregateProductToCategory(category: Category, product: Product): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }
    findCategoryByProductId(product: Product): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }


    async createCategory(category: Category): Promise<Result<Category>> {
        try {
            const entry = await this.mapper.fromDomaintoPersistence(category);
            const response = await this.save(entry);
            
            if (entry.image) {
                await this.ormCategoryImageRepository.save(entry.image);
            }
    
            return Result.success(category);
        } catch (error) {
        console.log("error en el repo es",error);

            return Result.fail(new PersistenceException('Create category unsuccessfully'));
        }
    }
    
    async findById(id: CategoryID): Promise<Result<Category>> {
        try {
            const categoryEntity = await this.findOne({
                where: { id: id.Value },
                relations: ['image', 'products'],
            });
    
            if (!categoryEntity) {
                return Result.fail(new NotFoundCategoryApplicationException()); // Manejo del caso en que no se encuentra la categoría
            }
    
            const category = await this.mapper.fromPersistencetoDomain(categoryEntity);
            return Result.success(category); // Envolvemos la categoría en `Result.success`
        } catch (error) {
            return Result.fail(new PersistenceException('Find category by ID unsuccessfully')); // Manejo de errores
        }
    }
    

    async verifyCategoryExistenceByName(name: CategoryName): Promise<Result<boolean>> {
        try {
            const existingCategory = await this.findOne({
                where: { name: name.Value },
            });
            return Result.success(!!existingCategory); // Retorna un `Result` booleano
        } catch (error) {
            return Result.fail(new PersistenceException('Verify category existence by name unsuccessfully'));
        }
    }

    async deleteCategoryById(id: CategoryID): Promise<Result<CategoryID>> {
        try {
            // Utilizamos `id.Value` para extraer el identificador primitivo
            await this.delete({ id: id.Value });
            return Result.success(id); // Devolvemos `Result.success()` sin ningún valor
        } catch (error) {
            return Result.fail(new PersistenceException('Delete category unsuccessfully'));
        }
    }
    
    async findAll(): Promise<Result<Category[]>> {
        try {
            const ormCategories = await this.find();

            if (!ormCategories || ormCategories.length === 0) {
                return Result.fail(new NotFoundCategoryApplicationException());
            }

            const categories = await Promise.all(
                ormCategories.map((ormCategory) => this.mapper.fromPersistencetoDomain(ormCategory))
            );

            return Result.success(categories);
        } catch (e) {
            return Result.fail(new NotFoundCategoryApplicationException());
        }
    }
}
