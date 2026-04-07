import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICard {
    title: string;
    category?: string;
    image?: string;
    price: number | null;
    description?: string;
    index?: number;
    buttonTitle?: string;
}

export abstract class Card<T extends ICard> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement | null; 
    protected _category?: HTMLElement | null;
    protected _button?: HTMLButtonElement | null;

    constructor(container: HTMLElement, actions?: { onClick: (event: MouseEvent) => void }) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector<HTMLImageElement>('.card__image');
        this._category = container.querySelector<HTMLElement>('.card__category');
        this._button = container.querySelector<HTMLButtonElement>('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) { 
        this._title.textContent = String(value); 
    }

    set price(value: number | null) {
        this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
        if (this._button && value === null) {
            this._button.disabled = true;
        }
    }

    set image(value: string) { 
        if (this._image) { 
            this._image.src = value; 
            this._image.alt = this._title.textContent || ''; 
        } 
    }
}



