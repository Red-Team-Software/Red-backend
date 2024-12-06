// src/category/domain/aggregate/category.ts

import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { CategoryID } from '../value-object/category-id';
import { CategoryName } from '../value-object/category-name';
import { CategoryImage } from '../value-object/category-image';
import { DomainEvent } from 'src/common/domain/domain-event/domain-event';
import { CategoryCreated } from '../domain-events/category-created';
import { ProductID } from 'src/product/domain/value-object/product-id';

export class Category extends AggregateRoot<CategoryID> {
    private categoryName: CategoryName;
    private categoryImage: CategoryImage | null; // Opcional para manejar categorías sin imagen
    private products: ProductID[] = []; // Lista de productos de la categoría

    private constructor(id: CategoryID, name: CategoryName, categoryImage: CategoryImage|null, products?: ProductID[]) {
        super(id);
        this.categoryName = name;
        this.categoryImage = categoryImage || null;
        this.products = products || []; // Si no se pasa un array de productos, lo inicializa como vacío
    }
    // Método de fábrica para crear una nueva categoría y registrar el evento de creación
    static create(
        id: CategoryID,
        name: CategoryName,
        image: CategoryImage | null,
        productIds: ProductID[],
    ): Category {
        const category = new Category(id, name, image,productIds);
        category.apply(CategoryCreated.create(id, name, image, productIds)); // Aplicamos el evento con productos
        return category;
    }

    // Método para inicializar una categoría existente (sin registrar evento)
    static initializeAggregate(id: CategoryID, name: CategoryName, image: CategoryImage | null): Category {
        const category = new Category(id, name, image);
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
                this.products = categoryCreatedEvent.products.map(id => ProductID.create(id.Value)); // Mapeamos los IDs de productos
        }
    }

    // Validación del estado de la categoría
    protected validateState(): void {
        if (!this.getId() || !this.categoryName) {
            throw new Error("Invalid category state: ID and name must be defined");
        }
    }

    // Métodos `get` para acceder a los campos de la categoría
    getName(): CategoryName {
        return this.categoryName;
    }

    getImage(): CategoryImage | null {
        return this.categoryImage;
    }
    getProducts():ProductID[]{
        return this.products;
    }
}
