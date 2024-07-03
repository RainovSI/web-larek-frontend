import './scss/styles.scss';

import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { ProductAPI } from './components/base/ProductAPI';
import { ApplicationStateModel } from './components/AppState';
import { MainPage } from './components/MainPage';
import { ProductCard, BasketCard } from './components/common/ProductCard';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { DeliveryOrder } from './components/common/DeliveryOrder';
import { UserContacts } from './components/common/UserContacts';
import { SuccessOrder } from './components/common/SuccessOrder';
import {
	PaymentMethod,
	IProductDetails,
	IDeliveryOrder,
	IUserContacts,
	CatalogChangeEvent,
} from './types/index';
import { API_URL, CDN_URL } from './utils/constants';

const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
};

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL);
const appState = new ApplicationStateModel({}, events);
const mainPage = new MainPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(templates.basket), events);
const order = new DeliveryOrder(cloneTemplate(templates.order), events);
const contacts = new UserContacts(cloneTemplate(templates.contacts), events);

const updateCatalog = () => {
	mainPage.catalog = appState.catalog.map((item) => {
		const card = new ProductCard('card', cloneTemplate(templates.cardCatalog), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
	mainPage.counter = appState.checkContentBasket().length;
};

events.on<CatalogChangeEvent>('items:changed', updateCatalog);

events.on('card:select', (item: IProductDetails) => {
	appState.setPreview(item);
});

events.on('preview:changed', (item: IProductDetails) => {
	if (item) {
		const card = new ProductCard('card', cloneTemplate(templates.cardPreview), {
			onClick: () => {
				appState.checkBasket(item)
					? events.emit('product:delete', item)
					: events.emit('product:added', item);
			},
		});

		modal.render({
			content: card.render({
				...item,
				button: appState.checkBasket(item) ? 'Удалить' : 'В корзину',
			}),
		});
	} else {
		modal.close();
	}
});

events.on('product:added', (item: IProductDetails) => {
	appState.addInBasket(item);
	modal.close();
});

events.on('product:delete', (item: IProductDetails) => {
	appState.removeFromBasket(item.id);
	modal.close();
});

events.on('order:open', () => {
	order.setClass('card');
	appState.setPayment('card');
	modal.render({
		content: order.render({ address: '', valid: false, errors: [] }),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:changed', ({ target }: { target: PaymentMethod }) => {
	appState.setPayment(target);
});

events.on('formErrors:change', (errors: Partial<IDeliveryOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
});

events.on('formContactsErrors:change', (errors: Partial<IUserContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

events.on(
	/^contacts\..*:change/,
	({ field, value }: { field: keyof IUserContacts; value: string }) => {
		appState.setOrderField(field, value);
	}
);

events.on('order.address:change', ({ value }: { value: string }) => {
	appState.setAddress(value);
});

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

events.on('basket:change', () => {
	const contentBasket = appState.checkContentBasket();
	mainPage.counter = contentBasket.length;
	basket.items = contentBasket.map((product, index) => {
		const card = new BasketCard(index, cloneTemplate(templates.cardBasket), {
			onClick: () => {
				appState.removeFromBasket(product.id);
				basket.total = appState.getTotal();
			},
		});
		return card.render({ title: product.title, price: product.price });
	});
	basket.total = appState.getTotal();
});

events.on('contacts:submit', () => {
	appState.setOrder();
	api
		.submitOrder(appState.order)
		.then(() => {
			const success = new SuccessOrder(
				cloneTemplate(templates.success),
				appState.order.total,
				{
					onClick: () => {
						modal.close();
						appState.clearBasket();
						order.setClass('');
						events.emit('basket:change');
					},
				}
			);
			modal.render({ content: success.render({}) });
			appState.clearBasket();
		})
		.catch(console.error);
});

events.on('basket:change', () => {
	mainPage.counter = appState.checkContentBasket().length;
	basket.items = appState.checkContentBasket().map((product, index) => {
		const card = new BasketCard(index, cloneTemplate(templates.cardBasket), {
			onClick: () => {
				appState.removeFromBasket(product.id);
				basket.total = appState.getTotal();
			},
		});
		return card.render({ title: product.title, price: product.price });
	});
	basket.total = appState.getTotal();
});

events.on('modal:open', () => {
	mainPage.locked = true;
});

events.on('modal:close', () => {
	mainPage.locked = false;
});

api
	.getProductsList()
	.then(appState.setCatalog.bind(appState))
	.catch(console.error);
