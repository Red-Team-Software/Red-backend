import { DomainEvent } from "src/common/domain/domain-event";

export interface IEventSubscriber<T extends DomainEvent> {
    on(event: T): Promise<void>;
}