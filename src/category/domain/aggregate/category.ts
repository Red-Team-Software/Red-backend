// src/category/domain/aggregate/category.ts

import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { CategoryId } from '../value-object/category-id';
import { CategoryName } from '../value-object/category-name';
import { CategoryImage } from '../value-object/category-image';
import { DomainEvent } from 'src/common/domain/domain-event/domain-event';
import { CategoryCreated } from '../domain-events/category-created';

export class Category extends AggregateRoot<CategoryId> {
    private categoryName: CategoryName;
    private categoryImage: CategoryImage | null; // Opcional para manejar categorías sin imagen

    private constructor(id: CategoryId, name: CategoryName, image: CategoryImage | null) {
        super(id);
        this.categoryName = name;
        this.categoryImage = image;
    }

    // Método de fábrica para crear una nueva categoría y registrar el evento de creación
    static create(id: CategoryId, name: CategoryName, image: CategoryImage | null): Category {
        const category = new Category(id, name, image);
        category.apply(CategoryCreated.create(id, name, image));
        return category;
    }

    // Método para inicializar una categoría existente (sin registrar evento)
    static initializeAggregate(id: CategoryId, name: CategoryName, image: CategoryImage | null): Category {
        const category = new Category(id, name, image);
        category.validateState();
        return category;
    }

    // Método `when` para manejar los eventos de dominio
    protected when(event: DomainEvent): void {
        switch (event.getEventName) {
            case 'CategoryCreated':
                const categoryCreated = event as CategoryCreated;
                this.categoryName = categoryCreated.categoryName;
                this.categoryImage = categoryCreated.categoryImage;
                break;
            // Agregar otros casos de eventos de dominio si es necesario
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
}
