import './scss/styles.scss';

import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { ProductAPI } from './components/ProductAPI';
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

enum EventTypes {
	ItemsChanged = 'items:changed',
	CardSelect = 'card:select',
	PreviewChanged = 'preview:changed',
	ProductAdded = 'product:added',
	ProductDelete = 'product:delete',
	OrderOpen = 'order:open',
	OrderSubmit = 'order:submit',
	ContactsOpen = 'contacts:open',
	PaymentChanged = 'payment:changed',
	FormErrorsChange = 'formErrors:change',
	FormContactsErrorsChange = 'formContactsErrors:change',
	ContactsChange = 'contacts..*:change',
	OrderAddressChange = 'order.address:change',
	BasketOpen = 'basket:open',
	BasketChange = 'basket:change',
	ContactsSubmit = 'contacts:submit',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
}

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
const successOrder = new SuccessOrder(cloneTemplate(templates.success), {
	onClick: () => {
		modal.close();
		appState.clearBasket();
		order.setClass('');
		events.emit(EventTypes.BasketChange);
	},
});

const updateCatalog = () => {
	mainPage.catalog = appState.catalog.map((item) => {
		const card = new ProductCard('card', cloneTemplate(templates.cardCatalog), {
			onClick: () => events.emit(EventTypes.CardSelect, item),
		});
		return card.render(item);
	});
	mainPage.counter = appState.checkContentBasket().length;
};

events.on<CatalogChangeEvent>(EventTypes.ItemsChanged, updateCatalog);

events.on(EventTypes.CardSelect, (item: IProductDetails) => {
	appState.setPreview(item);
});

events.on(EventTypes.PreviewChanged, (item: IProductDetails) => {
	if (item) {
		const card = new ProductCard('card', cloneTemplate(templates.cardPreview), {
			onClick: () => {
				appState.checkBasket(item)
					? events.emit(EventTypes.ProductDelete, item)
					: events.emit(EventTypes.ProductAdded, item);
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

events.on(EventTypes.ProductAdded, (item: IProductDetails) => {
	appState.addInBasket(item);
	modal.close();
});

events.on(EventTypes.ProductDelete, (item: IProductDetails) => {
	appState.removeFromBasket(item.id);
	modal.close();
});

events.on(EventTypes.OrderOpen, () => {
	order.setClass('card');
	appState.setPayment('card');
	modal.render({
		content: order.render({ address: '', valid: false, errors: [] }),
	});
});

events.on(EventTypes.OrderSubmit, () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(EventTypes.ContactsOpen, () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	EventTypes.PaymentChanged,
	({ target }: { target: PaymentMethod }) => {
		appState.setPayment(target);
	}
);

events.on(EventTypes.FormErrorsChange, (errors: Partial<IDeliveryOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
});

events.on(
	EventTypes.FormContactsErrorsChange,
	(errors: Partial<IUserContacts>) => {
		const { email, phone } = errors;
		contacts.valid = !email && !phone;
		contacts.errors = Object.values({ phone, email })
			.filter(Boolean)
			.join('; ');
	}
);

events.on(
	new RegExp(EventTypes.ContactsChange),
	({ field, value }: { field: keyof IUserContacts; value: string }) => {
		appState.setOrderField(field, value);
	}
);

events.on(EventTypes.OrderAddressChange, ({ value }: { value: string }) => {
	appState.setAddress(value);
});

events.on(EventTypes.BasketOpen, () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

events.on(EventTypes.BasketChange, () => {
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

events.on(EventTypes.ContactsSubmit, () => {
	appState.setOrder();
	api
		.submitOrder(appState.order)
		.then(() => {
			successOrder.updateTotal(appState.order.total);
			modal.render({ content: successOrder.render({}) });
			appState.clearBasket();
		})
		.catch(console.error);
});

events.on(EventTypes.BasketChange, () => {
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

events.on(EventTypes.ModalOpen, () => {
	mainPage.locked = true;
});

events.on(EventTypes.ModalClose, () => {
	mainPage.locked = false;
});

api
	.getProductsList()
	.then(appState.setCatalog.bind(appState))
	.catch(console.error);
