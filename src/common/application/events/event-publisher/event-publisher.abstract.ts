import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { IEventSubscriber } from "../event-subscriber/event-subscriber.interface";

export abstract class IEventPublisher {
	protected subscribers: Map<string, IEventSubscriber<DomainEvent>[]>;

	constructor() {
		this.subscribers = new Map<string, IEventSubscriber<DomainEvent>[]>();
	}

	abstract publish(events: DomainEvent[]): Promise<void>;

	private includes(
		event: string,
		subscriber: IEventSubscriber<DomainEvent>
	): boolean {
		if (!this.subscribers.has(event)) return false;
		return this.subscribers.get(event).includes(subscriber);
	}

	subscribe<T extends DomainEvent,Entry extends string,Exit>(
		event: string,
		subscribers: IEventSubscriber<DomainEvent>[],
		mapper: (json: Record<Entry,Exit>) => T
	): void {
		this.subscribers.set(event, subscribers);
	}

	unSubscribe(event: string, subscriber: IEventSubscriber<DomainEvent>): void {
		if (this.includes(event, subscriber))
			this.subscribers.set(
				event,
				this.subscribers.get(event).filter((sub) => sub !== subscriber)
			);
	}
}
