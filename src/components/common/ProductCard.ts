import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IBasketCard, ICard, ICardActions } from '../../types/index';

const categoryCard: Record<string, string> = {
	другое: '_other',
	'софт-скил': '_soft',
	'хард-скил': '_hard',
	дополнительное: '_additional',
	кнопка: '_button',
};

export class ProductCard extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(blockName: string, container: HTMLElement, events: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._description = container.querySelector(`.${blockName}__text`);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', events.onClick);
		} else {
			container.addEventListener('click', events.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this.setDisabled(this._button, true);
			}
		} else {
			this.setText(this._price, value + ' синапсов');
		}
	}

	get price(): number {
		return Number(this._price.textContent);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			'card__category' + categoryCard[value],
			true
		);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}

export class BasketCard extends Component<IBasketCard> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(idx: number, container: HTMLElement, events: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		this._button.addEventListener('click', events.onClick);

		this.setText(this._index, idx + 1);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}
}
