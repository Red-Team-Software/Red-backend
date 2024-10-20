import { EventBus } from "../publishers/event-bus";

export class EventManagerSingleton {
	static instance: EventBus;

	static getInstance(): EventBus {
		if (!EventManagerSingleton.instance) {
			EventManagerSingleton.instance = new EventBus();
		}
		return EventManagerSingleton.instance;
	}
}
