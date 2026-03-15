import { IProduct } from "../../../types";

export class Basket {
  protected _items: IProduct[] = [];

  constructor() {}

  getItems(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    this._items.push(item);
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  clear(): void {
    this._items = [];
  }

  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  inBasket(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}