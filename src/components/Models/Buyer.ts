import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected _buyer: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  constructor(protected events: IEvents) {}

  setData(buyer: Partial<IBuyer>): void {
    Object.assign(this._buyer, buyer);
    this.events.emit('buyer:changed', this._buyer);
  }

  getData(): IBuyer {
    return { ...this._buyer };
  }

  clear(): void {
    this._buyer.payment = null;
    this._buyer.email = "";
    this._buyer.phone = "";
    this._buyer.address = "";
    this.events.emit('buyer:clear');
  }

  validate(): boolean {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._buyer.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._buyer.email) {
      errors.email = "Укажите адрес электронной почты";
    }
    if (!this._buyer.phone) {
      errors.phone = "Укажите номер телефона";
    }
    if (!this._buyer.address) {
      errors.address = "Укажите адрес доставки";
    }

    this.events.emit('formErrors:change', errors);

    return Object.keys(errors).length === 0;
  }
}

