import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { CategoryID } from '../value-object/category-id';
import { CategoryName } from '../value-object/category-name';
import { CategoryImage } from '../value-object/category-image';
import { DomainEvent } from 'src/common/domain/domain-event/domain-event';
import { CategoryCreated } from '../domain-events/category-created';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { CategoryDeleted } from '../domain-events/category-deleted';
import { CategoryUpdatedName } from '../domain-events/update-category-name';
import { CategoryUpdatedImage } from '../domain-events/update-category-image';
import { CategoryUpdatedProductsDomainEvent } from '../domain-events/update-category-products';
import { CategoryUpdatedBundles } from '../domain-events/category-update-bundles';
export class Category extends AggregateRoot<CategoryID> {
    protected when(event: DomainEvent): void {
        switch (event.getEventName) {
            case 'CategoryCreated':
                const categoryCreatedEvent = event as CategoryCreated;
                this.categoryName = categoryCreatedEvent.categoryName;
                this.categoryImage = categoryCreatedEvent.categoryImage;
                this.products = categoryCreatedEvent.products;
                this.bundles = categoryCreatedEvent.bundles; 
                break;
        }
    }

    private constructor(
        id: CategoryID,
        private categoryName: CategoryName,
        private categoryImage: CategoryImage | null,
        private products: ProductID[], // Inicialización por defecto
        private bundles: BundleId[]
    ) {
        super(id);
    }

    static create(
        id: CategoryID,
        name: CategoryName,
        image: CategoryImage | null,
        productIds: ProductID[],
        bundleIds: BundleId[]
    ): Category {
        const category = new Category(
            id,
            name,
            image,
            productIds,
            bundleIds
        );
        category.apply(
            CategoryCreated.create(
                id,
                name,
                image,
                productIds,
                bundleIds
            )
        );
        category.validateState();
        return category;
    }

    static initializeAggregate(
        id: CategoryID,
        name: CategoryName,
        image: CategoryImage | null,
        productIds: ProductID[] = [], // Opcional
        bundleIds: BundleId[] = [] // Opcional
    ): Category {
        const category = new Category(
            id,
            name,
            image,
            productIds,
            bundleIds
        );
        category.validateState();
        return category;
    }

    protected validateState(): void {
        if (!this.getId() || !this.categoryName) {
            throw new Error("Invalid category state: ID and name must be defined");
        }
    }

    delete(): void {
        this.apply(
            CategoryDeleted.create(this.Id)
        );
    }

    public updateName(name: CategoryName): void {
        this.apply(
            CategoryUpdatedName.create(
                this.getId(),
                name
            )
        );
    }

    public updateImage(image: CategoryImage): void {
        this.apply(CategoryUpdatedImage.create(this.getId(), image));
    }

    public updateProducts(products?: ProductID[]): void {
        this.products = products || []; // Si no se proporciona, se inicializa como vacío
        this.apply(CategoryUpdatedProductsDomainEvent.create(this.getId(), this.products));
    }

    public updateBundles(bundles?: BundleId[]): void {
        this.bundles = bundles || []; // Si no se proporciona, se inicializa como vacío
        this.apply(CategoryUpdatedBundles.create(this.getId(), this.bundles));
    }

    public addProduct(product: ProductID): void {
        if (!this.products.some(existingProduct => existingProduct.Value === product.Value)) {
            this.products.push(product);
            this.apply(CategoryUpdatedProductsDomainEvent.create(this.getId(), this.products));
        }
    }

    public addBundle(bundle: BundleId): void {
        if (!this.bundles.some(existingBundle => existingBundle.Value === bundle.Value)) {
            this.bundles.push(bundle);
            this.apply(CategoryUpdatedBundles.create(this.getId(), this.bundles));
        }
    }

    // Métodos `get` para acceder a los campos de la categoría
    get Name(): CategoryName {
        return this.categoryName;
    }

    get Image(): CategoryImage | null {
        return this.categoryImage;
    }

    get Products(): ProductID[] {
        return this.products;
    }

    get Bundles(): BundleId[] {
        return this.bundles;
    }

    get Id(): CategoryID {
        return this.getId();
    }
}
