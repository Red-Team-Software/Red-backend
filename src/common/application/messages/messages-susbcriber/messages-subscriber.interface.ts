import { IQueue } from "../../queue/queue.interface";

export interface IMessagesSubscriber{
	consume<T,>( queue: IQueue, callback: (entry:T) => Promise<void> ):void
}
