import { Card, ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";

interface ICardBasket extends ICard {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container); 
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}



