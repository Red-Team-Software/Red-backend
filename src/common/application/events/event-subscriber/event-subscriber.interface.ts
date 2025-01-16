import { IQueue } from "../../queue/queue.interface";

export interface IEventSubscriber{
    consume<T>( queue: IQueue, callback: (entry:T) => Promise<void> ):void
}