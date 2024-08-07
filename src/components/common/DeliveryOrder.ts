import { ValidationForm } from './ValidationForm';
import { IEvents } from '../base/events';
import { IDeliveryOrder } from '../../types/index';

export class DeliveryOrder extends ValidationForm<IDeliveryOrder> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttons = Array.from(container.querySelectorAll('.button_alt'));

		this._buttons.forEach((element) =>
			element.addEventListener('click', (event: MouseEvent) => {
				const target = event.target as HTMLButtonElement;
				const name = target.name;
				this.setClass(name);
				events.emit('payment:changed', { target: name });
			})
		);
	}

	setClass(name: string): void {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set address(address: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			address;
	}
}
