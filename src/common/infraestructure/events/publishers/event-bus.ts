import { IEventPublisher } from "src/common/application/events/event-publisher.abstract";
import { DomainEvent } from "src/common/domain/domain-event";

export class EventBus extends IEventPublisher {
	constructor() {
		super();
	}

	async publish(events: DomainEvent[]): Promise<void> {
		for (const event of events) {
			const subscribers = this.subscribers.get(event.constructor.name);
			if (subscribers) {
				await Promise.all(
					subscribers.map(async (subscriber) => {
						return subscriber.on(event);
					})
				);
			}
		}
	}
}
