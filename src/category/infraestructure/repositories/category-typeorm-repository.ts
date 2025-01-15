import { ICategoryCommandRepository } from "src/category/domain/repository/category-command-repository.interface";
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
import { Bundle } from "src/bundle/domain/aggregate/bundle.aggregate";

export class OrmCategoryCommandRepository extends Repository<OrmCategoryEntity> implements ICategoryCommandRepository {
    private mapper: IMapper<Category, OrmCategoryEntity>;
    private readonly ormCategoryImageRepository: Repository<OrmCategoryImage>;

    constructor(dataSource: DataSource) {
        super(OrmCategoryEntity, dataSource.createEntityManager());
        this.mapper = new OrmCategoryMapper(new UuidGen(), dataSource);
        this.ormCategoryImageRepository = dataSource.getRepository(OrmCategoryImage);
    }

    async agregateBundleToCategory(category: Category, bundle: Bundle): Promise<Result<boolean>> {
        try {
            const categoryEntity = await this.findOne({ where: { id: category.getId().Value }, relations: ["bundles"] });

            if (!categoryEntity) {
                return Result.fail(new NotFoundCategoryApplicationException());
            }

            if (!categoryEntity.bundles.some(b => b.id === bundle.getId().Value)) {
                categoryEntity.bundles.push({ id: bundle.getId().Value } as any);
                await this.save(categoryEntity);
            }

            return Result.success(true);
        } catch (error) {
            return Result.fail(new PersistenceException("Failed to add bundle to category."));
        }
    }


    async agregateProductToCategory(category: Category, product: Product): Promise<Result<boolean>> {
        try {
            const categoryEntity = await this.findOne({ where: { id: category.getId().Value }, relations: ["products"] });

            if (!categoryEntity) {
                return Result.fail(new NotFoundCategoryApplicationException());
            }

            if (!categoryEntity.products.some(p => p.id === product.getId().Value)) {
                categoryEntity.products.push({ id: product.getId().Value } as any);
                await this.save(categoryEntity);
            }

            return Result.success(true);
        } catch (error) {
            return Result.fail(new PersistenceException("Failed to add product to category."));
        }
    }



    async createCategory(category: Category): Promise<Result<Category>> {
        try {
            const entry = await this.mapper.fromDomaintoPersistence(category);
            
            const response = await this.save(entry);
    
            return Result.success(category);
        } catch (error) {
            return Result.fail(new PersistenceException('Create category unsuccessfully'));
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
    

    async updateCategory(category: Category): Promise<Result<Category>> {
        const persis = await this.mapper.fromDomaintoPersistence(category);
        try {
            // Actualiza la entidad principal (categoría)
            const result = await this.upsert(persis, ['id']);

            // Elimina las imágenes antiguas asociadas a la categoría
            if (persis.image) {
                await this.ormCategoryImageRepository.delete({ category: { id: category.getId().Value } });
                await this.ormCategoryImageRepository.save(persis.image);
            }

            return Result.success(category);
        } catch (e) {
            return Result.fail(new PersistenceException('Update category unsuccessfully'));
        }
    }
    
}
