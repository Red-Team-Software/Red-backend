import { IApplicationService } from 'src/common/application/services/application.service.interface';
import { Result } from 'src/common/utils/result-handler/result';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { FindAllCategoriesApplicationRequestDTO } from '../../dto/request/find-all-categories-request.dto';
import { FindAllCategoriesApplicationResponseDTO } from '../../dto/response/find-all-categories-response.dto';
import { NotFoundCategoryApplicationException } from '../../application-exception/not-found-category-application-exception';

export class FindAllCategoriesApplicationService extends IApplicationService<
  FindAllCategoriesApplicationRequestDTO,
  FindAllCategoriesApplicationResponseDTO[]
> {
  constructor(
    private readonly queryCategoryRepository: IQueryCategoryRepository
  ) {
    super();
  }

  async execute(data: FindAllCategoriesApplicationRequestDTO): Promise<Result<FindAllCategoriesApplicationResponseDTO[]>> {
    data.page = data.page * data.perPage - data.perPage;

    const response = await this.queryCategoryRepository.findAllCategories(data);
    if (!response.isSuccess()) {
      return Result.fail(new NotFoundCategoryApplicationException());
    }
    
    const categories = response.getValue;
    const responseDto: FindAllCategoriesApplicationResponseDTO[] = [];

    categories.forEach((category) => {
      responseDto.push( {
        categoryId: category.getId().Value,
        categoryName: category.Name.Value,
        categoryImage: category.Image.Value,
        //TODO QUITAR ESTO DE POR MEDIO DE {id:strin}
        products: category.Products.map((productId) => ({id:productId.Value})),
      })
    });

    return Result.success(responseDto);
  }
}
