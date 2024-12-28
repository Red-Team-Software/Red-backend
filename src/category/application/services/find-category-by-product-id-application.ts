
import { IApplicationService } from "src/common/application/services/application.service.interface";
import { FindCategoryByProductIdApplicationRequestDTO } from "../dto/request/find-category-by-productid-application-request.dto";
import { FindCategoryByProductIdApplicationResponseDTO } from "../dto/response/find-category-by-productid-application-response.dto";
import { IQueryCategoryRepository } from "src/category/application/query-repository/query-category-repository";
import { Result } from "src/common/utils/result-handler/result";
import { NotFoundCategoryApplicationException } from "../application-exception/not-found-category-application-exception";

export class FindCategoryByProductIdApplicationService extends IApplicationService<
  FindCategoryByProductIdApplicationRequestDTO,
  FindCategoryByProductIdApplicationResponseDTO[]
> {
  constructor(
    private readonly queryCategoryRepository: IQueryCategoryRepository
  ) {
    super();
  }

  async execute(data: FindCategoryByProductIdApplicationRequestDTO): Promise<Result<FindCategoryByProductIdApplicationResponseDTO[]>> {
    // Consultar el repositorio para obtener las categorías que contienen el producto con el ID proporcionado
    const response = await this.queryCategoryRepository.findCategoryByProductId(data);

    if (!response.isSuccess()) {
      return Result.fail(new NotFoundCategoryApplicationException());
    }

    const categories = response.getValue;
    const responseDto: FindCategoryByProductIdApplicationResponseDTO[] = categories.map((category) => ({
      id: category.getId().Value,
      name: category.getName().Value,
      image: category.getImage().Value,
      products: category.getProducts().map((productId) => productId.Value),
    }));

    return Result.success(responseDto);
  }
}