import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IEventSubscriber } from "src/common/application/events/event-subscriber/event-subscriber.interface";
import { Message } from "src/common/application/events/message/message";
import { IMessagesPublisher } from "src/common/application/messages/messages-publisher/messages-publisher.interface";
import { DomainEvent } from "src/common/domain/domain-event/domain-event";

export class MessagePublisherMock implements IMessagesPublisher {

	constructor(suscriber:IEventSubscriber[]){}

	async publish(events: Message[]): Promise<void> {}

}
