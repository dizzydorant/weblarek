import { IApi } from "../../types";
import { IProduct, IProductList, IOrder, IOrderResult  } from "../../types";

export class LarekApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProductList(): Promise<IProduct[]> {
        return this._api.get<IProductList>('/product')
            .then((data: IProductList) => data.items);
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}