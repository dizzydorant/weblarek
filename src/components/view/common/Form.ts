import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[]; 
}

export class Form<T> extends Component<IFormState & T> { 
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string[]) {
        this._errors.textContent = value.join('; ');
    }

    render(state: Partial<IFormState & T>) {
        super.render(state);
        return this.container;
    }
}



