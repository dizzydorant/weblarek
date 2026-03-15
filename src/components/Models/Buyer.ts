import { IBuyer } from "../../../types";

export class Buyer {

  protected _buyer: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  constructor() {}

  setData(buyer: Partial<IBuyer>): void {
    Object.assign(this._buyer, buyer);
  }

  getData(): IBuyer {
    return { ...this._buyer };
  }

  clear(): void {
    this._buyer.payment = null;
    this._buyer.email = "";
    this._buyer.phone = "";
    this._buyer.address = "";
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
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

    return errors;
  }
}
