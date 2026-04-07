import { Card, ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";

export class CardBasket extends Card<ICard> {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}

