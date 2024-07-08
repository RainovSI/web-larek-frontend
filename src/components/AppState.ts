import {
	IApplicationState,
	IOrderData,
	IProductDetails,
	FormErrors,
	PaymentMethod,
} from '../types';
import { Model } from './base/Model';
import { IUserContacts } from '../types/index';

export class ApplicationStateModel extends Model<IApplicationState> {
	basket: IProductDetails[] = [];
	catalog: IProductDetails[] = [];
	order: IOrderData = {
		email: '',
		phone: '',
		items: [],
		payment: 'card',
		address: '',
		total: 0,
	};
	preview: string | null = null;
	formErrors: FormErrors = {};

	addInBasket(item: IProductDetails): void {
		this.basket.push(item);
		this.emitChanges('basket:change');
	}

	removeFromBasket(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
		this.emitChanges('basket:change');
	}

	clearOrder(): void {
		this.order = {
			email: '',
			phone: '',
			items: [],
			payment: 'card',
			address: '',
			total: 0,
		};
	}

	clearBasket(): void {
		this.basket = [];
		this.clearOrder();
		this.emitChanges('basket:change');
	}

	getTotal() {
		return this.basket.reduce((summ, product) => summ + product.price, 0);
	}

	setCatalog(items: IProductDetails[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: IProductDetails) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	checkContentBasket(): IProductDetails[] {
		return this.basket;
	}

	checkBasket(item: IProductDetails) {
		return this.basket.includes(item);
	}

	setOrder(): void {
		this.order.total = this.getTotal();
		this.order.items = this.checkContentBasket().map((item) => item.id);
	}

	setOrderField(field: keyof Partial<IUserContacts>, value: string): void {
		this.order[field] = value;
		this.validateOrderForm();
	}

	setPayment(itemPayment: PaymentMethod): void {
		this.order.payment = itemPayment;
		this.validateOrder();
	}

	setAddress(itemAddress: string): void {
		this.order.address = itemAddress;
		this.validateOrder();
	}

	setEmail(itemEmail: string): void {
		this.order.email = itemEmail;
		this.validateOrderForm();
	}

	setPhone(itemPhone: string): void {
		this.order.phone = itemPhone;
		this.validateOrderForm();
	}

	validateOrder(): void {
		const errors: FormErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
	}

	validateOrderForm() {
		const errors: FormErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+?[1-9]\d{1,14}$/;

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = 'Некорректный формат email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegex.test(this.order.phone)) {
			errors.phone = 'Некорректный формат телефона';
		}

		this.formErrors = errors;
		this.events.emit('formContactsErrors:change', this.formErrors);
	}
}
