import { IApplicationService } from "src/common/application/services/application.service.interface";
import { FindCategoryByIdApplicationRequestDTO } from "src/category/application/dto/request/find-category-by-id-application-request.dto";
import { FindCategoryByIdApplicationResponseDTO } from "src/category/application/dto/response/find-category-by-id-application-response.dto";
import { IQueryCategoryRepository } from "src/category/application/query-repository/query-category-repository";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "../../application-exception/not-found-category-application-exception";
import { CategoryID } from "src/category/domain/value-object/category-id";
export class FindCategoryByIdApplicationService extends IApplicationService< FindCategoryByIdApplicationRequestDTO,
  FindCategoryByIdApplicationResponseDTO> {
  constructor(
    private readonly queryCategoryRepository: IQueryCategoryRepository
  ) {
    super();
  }

  async execute(data: FindCategoryByIdApplicationRequestDTO): Promise<Result<FindCategoryByIdApplicationResponseDTO>> {
    const id=CategoryID.create(data.id)
    const response = await this.queryCategoryRepository.findCategoryById(id);

    if (!response.isSuccess()) {
      return Result.fail(new NotFoundCategoryApplicationException());
    }

    const category = response.getValue;
    const result:FindCategoryByIdApplicationResponseDTO={
      id:category.getId().Value,
      name:category.Name.Value,
      image:category.Image.Value || null,
      products:category.Products.map(product=>product.Value),
      bundles:category.Bundles.map(bundle=>bundle.Value)
    }
    return Result.success(result);
  }
}
