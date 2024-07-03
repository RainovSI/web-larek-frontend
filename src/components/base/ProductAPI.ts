import { Api, ApiListResponse } from './api';
import { IProductDetails, IOrderData, IOrderResponse } from '../../types/index';

export interface IProductAPI {
	getProductsList: () => Promise<IProductDetails[]>;
	getProductItem: (id: string) => Promise<IProductDetails>;
	submitOrder: (order: IOrderData) => Promise<IOrderResponse>;
}

export class ProductAPI extends Api implements IProductAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductsList(): Promise<IProductDetails[]> {
		return this.get('/product').then((data: ApiListResponse<IProductDetails>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProductDetails> {
		return this.get(`/product/${id}`).then((item: IProductDetails) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	submitOrder(order: IOrderData): Promise<IOrderResponse> {
		return this.post('/order', order).then((data: IOrderResponse) => data);
	}
}
