import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";
import { ValueObject } from "./value-object";

export abstract class AggregateRoot<T extends ValueObject<T>> extends Entity<T> {

    protected events: DomainEvent[] = [];

    protected abstract when(event: DomainEvent): void;
    protected abstract validateState(): void;

    protected apply(event: DomainEvent): void {
        this.when(event);
        this.validateState();
        this.events.push(event);
    }

    protected constructor(id: T, event: DomainEvent) {
        super(id);
        this.apply(event);
    }

    pullDomainEvents(): DomainEvent[] {
        const events = this.events;
        this.events = [];
        return events;
    }
}