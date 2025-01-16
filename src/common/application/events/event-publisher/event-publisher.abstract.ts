import { DomainEvent } from "src/common/domain/domain-event/domain-event";
import { IEventSubscriber } from "../event-subscriber/event-subscriber.interface";

export abstract class IEventPublisher {
	protected subscribers: Map<string, IEventSubscriber[]>;

	constructor() {
		this.subscribers = new Map<string, IEventSubscriber[]>();
	}

	abstract publish(events: DomainEvent[]): Promise<void>;

	private includes(
		event: string,
		subscriber: IEventSubscriber
	): boolean {
		if (!this.subscribers.has(event)) return false;
		return this.subscribers.get(event).includes(subscriber);
	}

	subscribe<T extends DomainEvent,Entry extends string,Exit>(
		event: string,
		subscribers: IEventSubscriber[],
		mapper: (json: Record<Entry,Exit>) => T
	): void {
		this.subscribers.set(event, subscribers);
	}

	unSubscribe(event: string, subscriber: IEventSubscriber): void {
		if (this.includes(event, subscriber))
			this.subscribers.set(
				event,
				this.subscribers.get(event).filter((sub) => sub !== subscriber)
			);
	}
}
