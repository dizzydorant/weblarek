import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    this._items.push(item);
    this.events.emit('basket:changed');
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this._items = [];
    this.events.emit('basket:changed');
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
