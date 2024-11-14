
import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { CategoryId } from "../value-object/category-id";
import { ComboId } from "src/Combo/domain/value-object/combo-id";

export class ComboAddedToCategory extends DomainEvent {
    categoryId: CategoryId;
    comboId: ComboId;

    private constructor(categoryId: CategoryId, comboId: ComboId) {
        super();
        this.categoryId = categoryId;
        this.comboId = comboId;
    }

    static create(categoryId: CategoryId, comboId: ComboId): ComboAddedToCategory {
        return new ComboAddedToCategory(categoryId, comboId);
    }

    serialize(): string {
        return JSON.stringify({
            eventName: this.getEventName,
            occurredOn: this.getOcurredOn,
            categoryId: this.categoryId.Value,
            comboId: this.comboId.Value
        });
    }
}
