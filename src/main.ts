import "./scss/styles.scss";

import { LarekApi } from "./components/LarekApi";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";

// Модели данных
import { Products } from "./components/Models/Products";
import { Basket as BasketModel } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";

// Компоненты представления
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/view/Gallery";
import { CardCatalog } from "./components/view/card/CardCatalog";
import { CardBasket } from "./components/view/card/CardBasket";
import { CardPreview } from "./components/view/card/CardPreview";
import { Modal } from "./components/view/common/Modals";
import { Basket as BasketView } from "./components/view/Basket";
import { Header } from "./components/view/Header";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";

// Типы
import { IProduct, IBuyer, IOrderResult } from "./types";

// Инициализация базовых инструментов
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

// Инициализация Моделей
const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);

// Инициализация Представлений
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const basketView = new BasketView(cloneTemplate("#basket"), events);
const orderForm = new Order(cloneTemplate("#order"), events);
const contactsForm = new Contacts(cloneTemplate("#contacts"), events);

const cardPreview = new CardPreview(cloneTemplate("#card-preview"), {
  onClick: () => events.emit("card:toggle-basket"),
});

const successView = new Success(cloneTemplate("#success"), {
  onClick: () => modal.close(),
});

/**
 * ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ
 */

// Изменение списка товаров (модель не отдает данные в событии)
events.on("items:changed", () => {
  gallery.catalog = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:select", { id: item.id }),
    });

    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: CDN_URL + item.image,
    });
  });
});

// Изменение корзины
events.on("basket:changed", () => {
  header.counter = basketModel.getCount();

  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => events.emit("basket:remove-item", { id: item.id }),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.render({
    items,
    total: basketModel.getTotal(),
  });
});

// Изменение данных покупателя (вызывается и при вводе, и при очистке модели)
events.on("buyer:changed", () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  const orderErrors = Object.values({
    payment: errors.payment,
    address: errors.address,
  }).filter((i): i is string => !!i);
  const contactErrors = Object.values({
    email: errors.email,
    phone: errors.phone,
  }).filter((i): i is string => !!i);

  orderForm.render({
    address: buyer.address,
    payment: buyer.payment ?? "",
    valid: !errors.payment && !errors.address,
    errors: orderErrors,
  });

  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: contactErrors,
  });
});

/**
 * ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ
 */

// Выбор карточки (используем ID для получения данных из модели)
events.on("card:select", (data: { id: string }) => {
  const item: IProduct | undefined = productsModel.getItem(data.id);

  if (item) {
    productsModel.setPreview(item);
    modal.render({
      content: cardPreview.render({
        title: item.title,
        price: item.price,
        image: CDN_URL + item.image,
        category: item.category,
        description: item.description,
        buttonTitle: basketModel.inBasket(item.id) ? "Удалить" : "В корзину",
      }),
    });
  }
});

// Удаление из корзины через брокер
events.on("basket:remove-item", (data: { id: string }) => {
  basketModel.remove(data.id);
});

// Переключение товара в корзине
events.on("card:toggle-basket", () => {
  const item = productsModel.getPreview();
  if (item) {
    if (basketModel.inBasket(item.id)) {
      basketModel.remove(item.id);
    } else {
      basketModel.add(item);
    }
    modal.close();
  }
});

// Работа с данными покупателя
events.on("payment:change", (data: { target: string }) => {
  buyerModel.setData({ payment: data.target as IBuyer["payment"] });
});

events.on(
  /^order\..*:change|^contacts\..*:change/,
  (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setData({ [data.field]: data.value });
  },
);

// Управление модальными окнами
events.on("basket:open", () => {
  modal.render({ content: basketView.render({}) });
});

events.on("order:open", () => {
  modal.render({ content: orderForm.render({}) });
});

events.on("order:submit", () => {
  modal.render({ content: contactsForm.render({}) });
});

// Финализация заказа
events.on("contacts:submit", () => {
  const orderData = {
    ...buyerModel.getData(),
    total: basketModel.getTotal(),
    items: basketModel.getItems().map((item) => item.id),
  };

  api
    .orderProducts(orderData)
    .then((result: IOrderResult) => {
      basketModel.clear();
      buyerModel.clear();

      modal.render({
        content: successView.render({
          total: result.total,
        }),
      });
    })
    .catch(console.error);
});

// СТАРТ ПРИЛОЖЕНИЯ
api
  .getProductList()
  .then((items: IProduct[]) => {
    productsModel.setItems(items);
  })
  .catch(console.error);
