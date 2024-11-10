// src/category/infrastructure/repositories/category-typeorm-repository.ts

import { CategoryRepository } from "src/category/domain/repository/category-repository";
import { Repository } from "typeorm";
import { OrmCategoryEntity } from "../entities/orm-entities/orm-category-entity";
import { Category } from "src/category/domain/aggregate/category";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryTypeORMRepository implements CategoryRepository {
    constructor(
        @InjectRepository(OrmCategoryEntity)
        private readonly ormRepository: Repository<OrmCategoryEntity>
    ) {}

    async save(category: Category): Promise<void> {
        const categoryEntity = new OrmCategoryEntity();
        categoryEntity.id = category.getId().Value;
        categoryEntity.name = category.getName();
        categoryEntity.products = []; // Si hay productos en `category`, puedes mapearlos aquí
        await this.ormRepository.save(categoryEntity);
    }

    async findById(id: CategoryId): Promise<Category | null> {
        const categoryEntity = await this.ormRepository.findOne({
            where: { id: id.Value },
            relations: ["products"], // Cargar productos asociados si es necesario
        });
        return categoryEntity
            ? Category.create(
                CategoryId.create(categoryEntity.id),
                CategoryName.create(categoryEntity.name)
            )
            : null;
            
    }

    async delete(id: CategoryId): Promise<void> {
        await this.ormRepository.delete(id.Value);
    }

    async findAll(): Promise<Category[]> {
        const categoryEntities = await this.ormRepository.find({ relations: ["products"] });
        return categoryEntities.map(
            (entity) =>
                Category.create(
                    CategoryId.create(entity.id),
                    CategoryName.create(entity.name)
                )
        );
    }
}
