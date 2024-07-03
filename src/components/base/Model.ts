import { EventEmitter } from './events';

export abstract class Model<T> {
	protected data: T;
	protected events: EventEmitter;

	constructor(initialData: Partial<T>, events: EventEmitter) {
		this.data = initialData as T;

		this.events = events;
	}

	getData(): T {
		return this.data;
	}

	updateData(newData: Partial<T>): void {
		Object.assign(this.data, newData);

		this.emitChanges('change', { newData });
	}

	emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload ?? {});
	}

	static isModel(obj: unknown): obj is Model<any> {
		return obj instanceof Model;
	}
}
