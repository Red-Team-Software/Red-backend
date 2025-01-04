// src/category/domain/aggregate/category.ts

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
import { CategoryUpdatedProducts } from '../domain-events/update-category-products';
import { CategoryUpdatedBundles } from '../domain-events/category-update-bundles';

export class Category extends AggregateRoot<CategoryID> {
    private categoryName: CategoryName;
    private categoryImage: CategoryImage | null; // Opcional para manejar categorías sin imagen
    private products: ProductID[] = []; // Lista de productos de la categoría
    private bundles: BundleId[] = []; // Lista de bundles de la categoría

    private constructor(
        id: CategoryID,
        name: CategoryName,
        categoryImage: CategoryImage | null,
        products?: ProductID[],
        bundles?: BundleId[]
    ) {
        super(id);
        this.categoryName = name;
        this.categoryImage = categoryImage || null;
        this.products = products || []; // Si no se pasa un array de productos, lo inicializa como vacío
        this.bundles = bundles || []; // Si no se pasa un array de bundles, lo inicializa como vacío
    }

    // Método de fábrica para crear una nueva categoría y registrar el evento de creación
    static create(
        id: CategoryID,
        name: CategoryName,
        image: CategoryImage | null,
        productIds: ProductID[] = [], //
        bundleIds: BundleId[] = [] 
    ): Category {
        const category = new Category(id, name, image, productIds, bundleIds);
        category.apply(CategoryCreated.create(id, name, image, productIds, bundleIds)); 
        return category;
    }

    // Método para inicializar una categoría existente (sin registrar evento)
    static initializeAggregate(
        id: CategoryID,
        name: CategoryName,
        image: CategoryImage | null,
        products: ProductID[] = [],
        bundles: BundleId[] = [] 
    ): Category {
        const category = new Category(id, name, image, products, bundles);
        category.validateState();
        return category;
    }

    // Método `when` para manejar los eventos de dominio
    protected when(event: DomainEvent): void {
        switch (event.getEventName) {
            case 'CategoryCreated':
                const categoryCreatedEvent = event as CategoryCreated;
                this.categoryName = categoryCreatedEvent.categoryName;
                this.categoryImage = categoryCreatedEvent.categoryImage;
                this.products = categoryCreatedEvent.products.map(id => ProductID.create(id.Value)); 
                this.bundles = categoryCreatedEvent.bundles.map(id => BundleId.create(id.Value)); 
        }
    }

    // Validación del estado de la categoría
    protected validateState(): void {
        if (!this.getId() || !this.categoryName) {
            throw new Error("Invalid category state: ID and name must be defined");
        }
    }

    delete(id:CategoryID):void{
        this.apply(
            CategoryDeleted.create(id)
        )
    }

    // Métodos de actualización
    public updateName(name: CategoryName): void {
        this.categoryName = name;
        this.apply(CategoryUpdatedName.create(this.getId(), name));
    }

    public updateImage(image: CategoryImage | null): void {
        this.categoryImage = image;
        this.apply(CategoryUpdatedImage.create(this.getId(), image));
    }

    public updateProducts(products: ProductID[]): void {
        this.products = products;
        this.apply(CategoryUpdatedProducts.create(this.getId(), products));
    }

    public updateBundles(bundles: BundleId[]): void {
        this.bundles = bundles;
        this.apply(CategoryUpdatedBundles.create(this.getId(), bundles));
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
}
