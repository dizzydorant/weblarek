import { Component } from "../../base/Component"; 
import { ensureElement } from "../../../utils/utils"; 
 
export class Modal extends Component<{ content: HTMLElement }> { 
    protected _closeButton: HTMLButtonElement; 
    protected _content: HTMLElement; 
 
    constructor(container: HTMLElement) { 
        super(container); 
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container); 
        this._content = ensureElement<HTMLElement>('.modal__content', container); 
 
        this._closeButton.addEventListener('click', this.close.bind(this)); 
        this.container.addEventListener('click', this.close.bind(this)); 
        this._content.addEventListener('click', (event) => event.stopPropagation()); 
    } 
 
    set content(value: HTMLElement) { 
        this._content.replaceChildren(value); 
    } 
 
    open() { 
        this.container.classList.add('modal_active'); 
    } 
 
    close() { 
        this.container.classList.remove('modal_active'); 
        this._content.replaceChildren(); 
    } 
 
    render(data: { content: HTMLElement }): HTMLElement { 
        super.render(data); 
        this.open(); 
        return this.container; 
    } 
}


