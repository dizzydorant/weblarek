import { Card, ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export interface ICardPreview extends ICard {
  description: string;
  image: string;
  category: string;
  buttonTitle?: string;
}

export class CardPreview extends Card<ICardPreview> {
  protected _description: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void },
  ) {
    super(container);

    this._description = ensureElement<HTMLElement>(".card__text", container);
    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set image(value: string) {
    this._image.src = value;
    this._image.alt = this.title;
  }

  set category(value: string) {
    const modifier = categoryMap[value as keyof typeof categoryMap] || "";
    this._category.textContent = value;
    this._category.className = `card__category ${modifier}`;
  }

  set price(value: number | null) {
    super.price = value;

    if (value === null) {
      this._button.disabled = true;
      this._button.textContent = "Недоступно";
    } else {
      this._button.disabled = false;
    }
  }

  set buttonTitle(value: string) {
    if (this._button.disabled === false) {
      this._button.textContent = value;
    }
  }
}
