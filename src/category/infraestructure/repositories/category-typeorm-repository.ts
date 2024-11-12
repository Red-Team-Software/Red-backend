import { CategoryRepository } from "src/category/domain/repository/category-repository";
import { Repository } from "typeorm";
import { OrmCategoryEntity } from "../entities/orm-entities/orm-category-entity";
import { Category } from "src/category/domain/aggregate/category";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "src/category/application/application-exception/not-found-category-application-exception";
import { OrmCategoryMapper } from "../mapper/orm-category-mapper";
import { OrmCategoryImage } from "../entities/orm-entities/orm-category-image.entity";
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception";

@Injectable()
export class CategoryTypeORMRepository implements CategoryRepository {
    constructor(
        @InjectRepository(OrmCategoryEntity)
        private readonly ormRepository: Repository<OrmCategoryEntity>,
        private readonly mapper: OrmCategoryMapper,
        private readonly ormCategoryImageRepository: Repository<OrmCategoryImage> // Repositorio para la imagen
    
    ) {}


    async createCategory(category: Category): Promise<Result<Category>> {
        try {
            // Convertimos la categoría de dominio a la entidad de persistencia
            const categoryEntity = await this.mapper.fromDomaintoPersistence(category);
            
            // Guardamos la entidad de categoría en el repositorio principal
            const savedCategory = await this.ormRepository.save(categoryEntity);
            
            // Si hay una imagen asociada, la guardamos en el repositorio de imágenes
            if (categoryEntity.image) {
                await this.ormCategoryImageRepository.save(categoryEntity.image);
            }
            
            return Result.success(category);
        } catch (error) {
            return Result.fail(new PersistenceException('Create category unsuccessfully'));
        }
    }
    async findById(id: CategoryId): Promise<Category | null> {
        const categoryEntity = await this.ormRepository.findOne({
            where: { id: id.Value },
            relations: ["image"], // Cargar la imagen asociada
        });
    
        return categoryEntity
            ? Category.create(
                CategoryId.create(categoryEntity.id),
                CategoryName.create(categoryEntity.name),
                categoryEntity.image ? CategoryImage.create(categoryEntity.image.url) : null // Manejo de la imagen
            )
            : null;
    }

    async verifyCategoryExistenceByName(name: CategoryName): Promise<boolean> {
        const existingCategory = await this.ormRepository.findOne({
            where: { name: name.Value },
        });
        return !!existingCategory; // Retorna `true` si existe, `false` en caso contrario
    }

    async delete(id: CategoryId): Promise<void> {
        await this.ormRepository.delete(id.Value);
    }

    async findAll(): Promise<Result<Category[]>> {
        try {
            const ormCategories = await this.ormRepository.find();

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
