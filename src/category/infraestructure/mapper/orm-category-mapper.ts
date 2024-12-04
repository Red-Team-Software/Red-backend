
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { OrmCategoryEntity } from "../entities/orm-entities/orm-category-entity";
import { CategoryId } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { OrmCategoryImage } from "../entities/orm-entities/orm-category-image.entity";

export class OrmCategoryMapper implements IMapper<Category, OrmCategoryEntity> {
    constructor(private readonly idGen: IIdGen<string>) {}

    async fromDomaintoPersistence(domainEntity: Category): Promise<OrmCategoryEntity> {
        // Crear la entidad de imagen de persistencia si existe en el dominio

        try {
            const ormImage = domainEntity.getImage()
            ? OrmCategoryImage.create(
                await this.idGen.genId(), 
                domainEntity.getImage().Value, 
                domainEntity.getId().Value
            )
            : null;

        // Construir la entidad de persistencia `OrmCategoryEntity`
        const data: OrmCategoryEntity = {
            id: domainEntity.getId().Value,
            name: domainEntity.getName().Value,
            image: ormImage,
            products:[]
        };

        return data;
        } catch (error) {
            console.log("Error en el mapper de category",error);
            
        }
        
    }

    async fromPersistencetoDomain(infraEntity: OrmCategoryEntity): Promise<Category> {
        // Convertir la entidad de persistencia a la de dominio
        const category = Category.create(
            CategoryId.create(infraEntity.id),
            CategoryName.create(infraEntity.name),
            CategoryImage.create(infraEntity.image.image) // Mapeo de la URL de la imagen si existe
        );

        return category;
    }
}
