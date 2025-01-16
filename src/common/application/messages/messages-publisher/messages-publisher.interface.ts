import { Message } from "../../events/message/message";

export interface IMessagesPublisher {
	publish(events: Message[]): Promise<void>;
}
