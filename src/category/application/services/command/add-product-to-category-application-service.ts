import { IApplicationService } from 'src/common/application/services';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { Result } from 'src/common/utils/result-handler/result';
import { ICategoryCommandRepository } from 'src/category/domain/repository/category-command-repository.interface';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { NotFoundCategoryApplicationException } from '../../application-exception/not-found-category-application-exception';
import { NotFoundProductApplicationException } from 'src/product/application/application-exepction/not-found-product-application-exception';
import { AddProductToCategoryApplicationRequestDTO } from '../../dto/request/add-product-to-category-application-request.dto';
import { AddProductToCategoryApplicationResponseDTO } from '../../dto/response/add-product-to-category-application-response.dto';
import { IQueryCategoryRepository } from '../../query-repository/query-category-repository';


export class AddProductToCategoryApplicationService extends IApplicationService<
  AddProductToCategoryApplicationRequestDTO,
  AddProductToCategoryApplicationResponseDTO
> {
  constructor(
    private readonly commandCategoryRepository: ICategoryCommandRepository,
    private readonly queryCategoryRepository: IQueryCategoryRepository,
    private readonly queryProductRepository: IQueryProductRepository,
    private readonly eventPublisher: IEventPublisher
  ) {
    super();
  }

  async execute(
    command: AddProductToCategoryApplicationRequestDTO
  ): Promise<Result<AddProductToCategoryApplicationResponseDTO>> {
    const categoryResult = await this.queryCategoryRepository.findCategoryById(
      CategoryID.create(command.categoryId)
    );

    if (!categoryResult.isSuccess()) {
      return Result.fail(new NotFoundCategoryApplicationException());
    }

    const productResult = await this.queryProductRepository.findProductById(
      ProductID.create(command.productId)
    );

    if (!productResult.isSuccess()) {
      return Result.fail(new NotFoundProductApplicationException());
    }

    const category = categoryResult.getValue;
    const productId = ProductID.create(command.productId);

    category.addProduct(productId);

    const updateResult = await this.commandCategoryRepository.updateCategory(category);

    if (!updateResult.isSuccess()) {
      return Result.fail(updateResult.getError);
    }

    await this.eventPublisher.publish(category.pullDomainEvents());
    let response: AddProductToCategoryApplicationResponseDTO = {
        ...command,
        categoryId: category.getId().Value,
        productId: productId.Value}
    return Result.success(response);
  }
}
