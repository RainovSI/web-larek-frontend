export type PaymentMethod = 'cash' | 'card';
export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IProductDetails {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderData {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export interface IApplicationState {
	catalog: IProductDetails[];
	basket: string[];
	order: IOrderData | null;
}

export interface IBasketView {
	items: HTMLElement;
	total: number;
}

export interface IDeliveryOrder {
	payment: PaymentMethod;
	address: string;
}

export interface IModalData {
	content: HTMLElement | null;
}

export type ICard = IProductDetails & {
	button?: string;
	id?: string;
	description?: string;
};

export interface IBasketCard {
	title: string;
	price: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccessOrder {
	total: number;
}

export interface ISuccessOrderActions {
	onClick: () => void;
}

export interface IUserContacts {
	email: string;
	phone: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export type CatalogChangeEvent = {
	catalog: IProductDetails[];
};

export interface IMainPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
