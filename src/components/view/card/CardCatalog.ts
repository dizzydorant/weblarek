import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";

interface ICardCatalog extends ICard {
  image: string;
  category: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void },
  ) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    const modifier = categoryMap[value as keyof typeof categoryMap] || "";
    this._category.textContent = value;
    this._category.className = `card__category ${modifier}`;
  }

  set image(value: string) {
    this._image.src = value;
    this._image.alt = this.title;
  }
}
