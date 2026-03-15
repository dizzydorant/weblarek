import { IProduct } from "../../../types";

export class Products {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;

  constructor (){}

  setItems(items: IProduct[]){
    this._items = items
  }

  getItems(): IProduct[] {
    return this._items
  }

  getItem(id:string): IProduct | undefined {
    return this._items.find((item) => item.id === id)
  }

   setPreview(item: IProduct): void {
    this._preview = item;
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
   
  