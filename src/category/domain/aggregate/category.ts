// src/Category/domain/aggregate/category.ts

import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { CategoryId } from '../value-object/category-id';
import { CategoryName } from '../value-object/category-name';
import { ProductID } from 'src/Product/domain/value-object/product-id';
//import { ComboId } from 'src/Combo/domain/value-object/combo-id';
import { CategoryCreated } from '../domain-events/category-created';
import { ProductAddedToCategory } from '../domain-events/product-added-to-category';
import { ComboAddedToCategory } from '../domain-events/combo-added-to-category';
import { DomainEvent } from 'src/common/domain/domain-event/domain-event';

export class Category extends AggregateRoot<CategoryId> {
    private readonly name: CategoryName;
    private products: ProductID[] = [];
//    private combos: ComboId[] = [];

    private constructor(id: CategoryId, name: CategoryName) {
        super(id);
        this.name = name;
        this.addEvent(CategoryCreated.create(id, name));
    }

    static create(id: CategoryId, name: CategoryName, products: unknown[]): Category {
        return new Category(id, name);
    }

    addProduct(productId: ProductID): void {
        if (!this.products.find(p => p.equals(productId))) {
            this.products.push(productId);
            this.addEvent(ProductAddedToCategory.create(this.getId(), productId)); // Usar getId()
        }
    }

 /*   addCombo(comboId: ComboId): void {
        if (!this.combos.find(c => c.equals(comboId))) {
            this.combos.push(comboId);
            this.addEvent(ComboAddedToCategory.create(this.getId(), comboId)); // Usar getId()
        }
    }*/

    private addEvent(event: DomainEvent): void {
        this.events.push(event);
    }

    pullDomainEvents(): DomainEvent[] {
        const domainEvents = [...this.events];
        this.events = [];
        return domainEvents;
    }

    protected when(event: DomainEvent): void {
        // Método sin lógica adicional
    }

    protected validateState(): void {
        if (!this.getId() || !this.name) {
            throw new Error("Invalid category state: ID and name must be defined");
        }
    }

    getName(): string {
        return this.name.Value;
    }

    getProducts(): ProductID[] {
        return this.products;
    }

    /*getCombos(): ComboId[] {
        return this.combos;
    }*/
}