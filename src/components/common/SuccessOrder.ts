import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ISuccessOrderActions, ISuccessOrder } from '../../types/index';

export class SuccessOrder extends Component<ISuccessOrder> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessOrderActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		this._close.addEventListener('click', actions.onClick);
	}

	public updateTotal(sinaps: number) {
		this.setText(this._total, 'списано ' + sinaps + ' синапсов');
	}
}
