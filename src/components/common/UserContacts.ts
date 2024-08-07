import { ValidationForm } from './ValidationForm';
import { IEvents } from '../base/events';
import { IUserContacts } from '../../types/index';

export class UserContacts extends ValidationForm<IUserContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
