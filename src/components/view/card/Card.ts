import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICard {
  title: string;
  price: number | null;
}

export abstract class Card<T extends ICard> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
  }

  set title(value: string) {
    this._title.textContent = String(value);
  }

  get title(): string {
    return this._title.textContent || "";
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : "Бесценно";
  }
}
