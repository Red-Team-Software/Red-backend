import { DataSource, Repository } from 'typeorm';
import { OrmCategoryEntity } from '../entities/orm-entities/orm-category-entity';
import { Result } from 'src/common/utils/result-handler/result';
import { Category } from 'src/category/domain/aggregate/category.aggregate';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmCategoryMapper } from '../mapper/orm-category-mapper';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { OrmCategoryImage } from '../entities/orm-entities/orm-category-image.entity';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { NotFoundException } from 'src/common/infraestructure/infraestructure-exception';
import { FindAllCategoriesApplicationRequestDTO } from 'src/category/application/dto/request/find-all-categories-request.dto';
import { FindCategoryByIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-id-application-request.dto';
import { FindCategoryByProductIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-productid-application-request.dto';
import { CategoryName } from 'src/category/domain/value-object/category-name';
export class OrmCategoryQueryRepository extends Repository<OrmCategoryEntity> implements IQueryCategoryRepository {

    private mapper: IMapper<Category, OrmCategoryEntity>;
    private readonly ormCategoryImageRepository: Repository<OrmCategoryImage>;

    constructor(dataSource: DataSource) {
        super(OrmCategoryEntity, dataSource.createEntityManager());
        this.mapper = new OrmCategoryMapper(new UuidGen(),dataSource);
        this.ormCategoryImageRepository = dataSource.getRepository(OrmCategoryImage);
    }
    async findCategoryByProductId(criteria: FindCategoryByProductIdApplicationRequestDTO): Promise<Result<Category[]>> {
        try {
            // Usamos el ProductID proporcionado en `criteria` para buscar todas las categorías que contienen este producto
            const ormCategories = await this.createQueryBuilder('category')
                .leftJoinAndSelect('category.image', 'image') // Cargar la imagen de la categoría
                .where(':productId = ANY(category.products)', { productId: criteria.id }) // Verifica si el productId está en el array de productos
                .getMany(); // Devuelve todas las categorías asociadas al producto
    
            if (ormCategories.length === 0) {
                return Result.fail(new NotFoundException('No categories found for the given product.'));
            }
    
            // Mapeamos todas las categorías encontradas desde ORM a dominio
            const categories: Category[] = [];
            for (const ormCategory of ormCategories) {
                const category = await this.mapper.fromPersistencetoDomain(ormCategory);
                categories.push(category);
            }
    
            return Result.success(categories);
        } catch (error) {
            return Result.fail(new NotFoundException('Error fetching categories by product ID.'));
        }
    }
    async verifyCategoryExistenceByName(categoryName: CategoryName): Promise<Result<boolean>> {
        try{
            let response=await this.existsBy({name:categoryName.Value})
            return Result.success(response)

        }catch(e){
            return Result.fail( new NotFoundException('Veify category existance unsucssessfully '))
        }
    } 

    async findCategoryById(criteria: FindCategoryByIdApplicationRequestDTO): Promise<Result<Category>> {
        try {
            const ormCategory = await this.findOne({
                where: { id: criteria.id },
                relations: ['image'],
            });

            if (!ormCategory) {
                return Result.fail(new NotFoundException('Category not found.'));
            }

            const category = await this.mapper.fromPersistencetoDomain(ormCategory);
            return Result.success(category);
        } catch (error) {
            return Result.fail(new NotFoundException('Error fetching category by ID.'));
        }
    }


    async findAllCategories(criteria: FindAllCategoriesApplicationRequestDTO): Promise<Result<Category[]>> {
        try {
            const ormCategories = await this.find({
                take: criteria.perPage,
                skip: criteria.page,
                relations: ['image'],
            });

            if (ormCategories.length === 0) {
                return Result.fail(new NotFoundException('No categories found, please try again.'));
            }

            const categories: Category[] = [];
            for (const categoryEntity of ormCategories) {
                categories.push(await this.mapper.fromPersistencetoDomain(categoryEntity));
            }
            return Result.success(categories);
        } catch (error) {
            return Result.fail(new NotFoundException('Error fetching categories, please try again.'));
        }
    }
}
