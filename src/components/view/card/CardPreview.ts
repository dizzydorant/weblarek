import { Card, ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";

export class CardPreview extends Card<ICard> {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container, actions);
        this._description = ensureElement<HTMLElement>('.card__text', container);
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonTitle(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
}

