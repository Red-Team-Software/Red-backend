
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Category } from "src/category/domain/aggregate/category.aggregate";
import { OrmCategoryEntity } from "../entities/orm-entities/orm-category-entity";
import { CategoryID } from "src/category/domain/value-object/category-id";
import { CategoryName } from "src/category/domain/value-object/category-name";
import { CategoryImage } from "src/category/domain/value-object/category-image";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { OrmCategoryImage } from "../entities/orm-entities/orm-category-image.entity";
import { OrmProductEntity } from "src/product/infraestructure/entities/orm-entities/orm-product-entity";
import { DataSource, Repository } from "typeorm";
import { ProductID } from "src/product/domain/value-object/product-id";
import { OrmBundleEntity } from "src/bundle/infraestructure/entities/orm-entities/orm-bundle-entity";

export class OrmCategoryMapper implements IMapper<Category, OrmCategoryEntity> {
    private readonly ormProductRepository:Repository<OrmProductEntity>
    private readonly ormBundleRepository:Repository<OrmBundleEntity>

    constructor(private readonly idGen: IIdGen<string>,dataSource:DataSource) {
        this.ormProductRepository=dataSource.getRepository(OrmProductEntity)
        this.ormBundleRepository=dataSource.getRepository(OrmBundleEntity)
    }

    async fromDomaintoPersistence(domainEntity: Category): Promise<OrmCategoryEntity> {
        let ormImage:OrmCategoryImage;
        let ormProducts:OrmProductEntity[]=[]
        let ormBundle:OrmBundleEntity[]=[]
            for (const product of domainEntity.Products){
                let response=await this.ormProductRepository.findOneBy({id:product.Value})
                if (response) 
                    ormProducts.push(response)
            }
            /*
            const ormImage = domainEntity.Image
            ? OrmCategoryImage.create(
                await this.idGen.genId(), 
                domainEntity.Image.Value, 
                domainEntity.getId().Value,
            )
            : null;
            */
            for (const bundle of domainEntity.Bundles){
                let response=await this.ormBundleRepository.findOneBy({id:bundle.Value})
                if (response) 
                    ormBundle.push(response)
            }

        const data= OrmCategoryEntity.create(
            domainEntity.getId().Value,
            domainEntity.Name.Value,
            ormImage,
            ormProducts,
            ormBundle
        )

        return data;        
    }

    async fromPersistencetoDomain(infraEntity: OrmCategoryEntity): Promise<Category> {
        // Convertir la entidad de persistencia a la de dominio
        const category = Category.create(
            CategoryID.create(infraEntity.id),
            CategoryName.create(infraEntity.name),
            CategoryImage.create(infraEntity.image.image),
            infraEntity.products.map(id=>ProductID.create(id.id))
        );

        return category;
    }
}
