import { IApplicationService } from "src/common/application/services/application.service.interface";
import { IQueryCategoryRepository } from "src/category/application/query-repository/query-category-repository";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "../application-exception/not-found-category-application-exception";
import { FindCategoryByBundleIdApplicationRequestDTO } from "../dto/request/find-category-by-bundle-id-application-request.dto";
import { FindCategoryByBundleIdApplicationResponseDTO } from "../dto/response/find-category-by-bundle-id-application-response.dto";

export class FindCategoryByBundleIdApplicationService extends IApplicationService<
  FindCategoryByBundleIdApplicationRequestDTO,
  FindCategoryByBundleIdApplicationResponseDTO[]
> {
  
  constructor(
    private readonly queryCategoryRepository: IQueryCategoryRepository
  ) {
    super();
  }

  async execute(data: FindCategoryByBundleIdApplicationRequestDTO): Promise<Result<FindCategoryByBundleIdApplicationResponseDTO[]>> {
    // Consultar el repositorio para obtener las categorías que contienen el bundle con el ID proporcionado
    const response = await this.queryCategoryRepository.findCategoryByBundleId(data);

    if (!response.isSuccess()) {
      return Result.fail(new NotFoundCategoryApplicationException());
    }

    const categories = response.getValue;
    const responseDto: FindCategoryByBundleIdApplicationResponseDTO[] = categories.map((category) => ({
      id: category.getId().Value,
      name: category.getName().Value,
      image: category.getImage().Value,
      bundles: category.getBundles().map((bundleId) => bundleId.Value),
    }));

    return Result.success(responseDto);
  }
}
