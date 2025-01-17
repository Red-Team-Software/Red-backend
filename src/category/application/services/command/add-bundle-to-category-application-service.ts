import { IApplicationService } from 'src/common/application/services';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { Result } from 'src/common/utils/result-handler/result';
import { ICategoryCommandRepository } from 'src/category/domain/repository/category-command-repository.interface';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { NotFoundCategoryApplicationException } from '../../application-exception/not-found-category-application-exception';
import { NotFoundBundleApplicationException } from 'src/bundle/application/application-exception/not-found-bundle-application-exception';
import { AddBundleToCategoryApplicationRequestDTO } from '../../dto/request/add-bundle-to-category-application-request';
import { AddBundleToCategoryApplicationResponseDTO } from '../../dto/response/add-bundle-to-category-application-response.dto';
import { IQueryCategoryRepository } from '../../query-repository/query-category-repository';

export class AddBundleToCategoryApplicationService extends IApplicationService<
  AddBundleToCategoryApplicationRequestDTO,
  AddBundleToCategoryApplicationResponseDTO
> {
  constructor(
    private readonly commandCategoryRepository: ICategoryCommandRepository,
    private readonly queryCategoryRepository: IQueryCategoryRepository,
    private readonly queryBundleRepository: IQueryBundleRepository,
    private readonly eventPublisher: IEventPublisher
  ) {
    super();
  }

  async execute(
    command: AddBundleToCategoryApplicationRequestDTO
  ): Promise<Result<AddBundleToCategoryApplicationResponseDTO>> {
    const categoryResult = await this.queryCategoryRepository.findCategoryById(
      CategoryID.create(command.categoryId)
    );

    if (!categoryResult.isSuccess()) {
      return Result.fail(new NotFoundCategoryApplicationException());
    }

    const bundleResult = await this.queryBundleRepository.findBundleById(
      BundleId.create(command.bundleId)
    );

    if (!bundleResult.isSuccess()) {
      return Result.fail(new NotFoundBundleApplicationException());
    }

    const category = categoryResult.getValue;
    const bundleId = BundleId.create(command.bundleId);
    let bundles=category.Bundles
    bundles.push(bundleId)
    category.updateBundles(bundles)
    const updateResult = await this.commandCategoryRepository.updateCategory(category);

    if (!updateResult.isSuccess()) {
      return Result.fail(updateResult.getError);
    }

    await this.eventPublisher.publish(category.pullDomainEvents());
    
    let response: AddBundleToCategoryApplicationResponseDTO = {
        ...command,
        categoryId: category.getId().Value,
        bundleId: bundleId.Value
    };
    return Result.success(response);
  }
}
