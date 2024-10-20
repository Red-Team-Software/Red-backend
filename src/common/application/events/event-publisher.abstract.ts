import { DomainEvent } from "src/common/domain/domain-event";
import { IEventSubscriber } from "./event-subscriber.interface";

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
		if (this.subscribers.has(event))
			return this.subscribers.get(event).includes(subscriber);
		return false;
	}

	subscribe<T extends DomainEvent>(
		event: string,
		subscribers: IEventSubscriber<DomainEvent>[],
		mapper: (json: Record<any, any>) => T
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
