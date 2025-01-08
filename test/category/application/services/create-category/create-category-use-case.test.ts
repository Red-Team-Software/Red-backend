import { Category } from 'src/category/domain/aggregate/category.aggregate';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { CategoryName } from 'src/category/domain/value-object/category-name';
import { CategoryImage } from 'src/category/domain/value-object/category-image';
import { OrmCategoryCommandRepository } from 'src/category/infraestructure/repositories/category-typeorm-repository';

import { EventPublisherMock } from 'test/common/mocks/infraestructure/event-publisher.mock';
import { IApplicationService } from 'src/common/application/services';

interface CreateCategoryCommand {
  categoryId: string;
  name: string;
  image: string;
  productIds: string[];
  bundleIds: string[];
}

export class CreateCategoryApplicationService implements IApplicationService {
  private eventPublisher: EventPublisher;
  private repository: OrmCategoryCommandRepository;

  constructor(eventPublisher: EventPublisher, repository: OrmCategoryCommandRepository) {
    this.eventPublisher = eventPublisher;
    this.repository = repository;
  }

  async execute(command: CreateCategoryCommand) {
    const { categoryId, name, image, productIds, bundleIds } = command;

    // Crear los Value Objects
    const categoryID = CategoryID.create(categoryId);
    const categoryName = CategoryName.create(name);
    const categoryImage = CategoryImage.create(image);

    // Crear la entidad Category
    const category = Category.initializeAggregate(
      categoryID,
      categoryName,
      categoryImage,
      productIds,
      bundleIds
    );

    // Guardar en el repositorio
    await this.repository.save(category);

    // Publicar evento
    this.eventPublisher.publish(category);
  }
}
