import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';

// Модели данных
import { Products } from './components/Models/Products';
import { Basket as BasketModel } from './components/Models/Basket'; 
import { Buyer } from './components/Models/Buyer'; 

// Компоненты представления
import { cloneTemplate, ensureElement } from './utils/utils';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/card/CardCatalog';
import { CardBasket } from './components/view/card/CardBasket';
import { CardPreview } from './components/view/card/CardPreview';
import { Modal } from './components/view/common/Modals';
import { Basket as BasketView } from './components/view/Basket';
import { Header } from './components/view/Header';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';

// Типы
import { IProduct, IBuyer, IOrderResult } from './types';

// --- Инициализация базовых инструментов ---
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi); // Оставляем 1 аргумент, как требует класс

// --- Инициализация Моделей ---
const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);

// --- Инициализация Представлений ---
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

// Компоненты для модальных окон
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new Order(cloneTemplate('#order'), events);
const contactsForm = new Contacts(cloneTemplate('#contacts'), events);

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// 1. Каталог (Главная страница)
events.on('items:changed', () => {
    gallery.catalog = productsModel.getItems().map(item => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category 
        });
    });
});

// 2. Превью товара
events.on('card:select', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate('#card-preview',), {
        onClick: () => {
            if (basketModel.inBasket(item.id)) {
                basketModel.remove(item.id);
            } else {
                basketModel.add(item);
            }
            modal.close();
        }
    });

    modal.render({
        content: card.render({
            ...item,
            image: CDN_URL + item.image,
            category: item.category,
            buttonTitle: basketModel.inBasket(item.id) ? 'Удалить из корзины' : 'В корзину'
        })
    });
});

// 3. Обновление корзины (ФИКС ДУБЛИРОВАНИЯ)
events.on('basket:changed', () => {
    header.counter = basketModel.getCount();


    
    // Принудительно очищаем список в DOM через доступ к защищенному полю _list, 
    // чтобы предотвратить накопление текстовых узлов "Корзина пуста"

    const items = basketModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate('#card-basket'), {
            onClick: () => basketModel.remove(item.id)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    

    basketView.render({
        items: items,
        total: basketModel.getTotal()
    });
});

// 4. Валидация форм (ФИКС БЛОКИРОВКИ "ДАЛЕЕ")
events.on('formErrors:change', (errors: Partial<IBuyer>) => {
    const { payment, address, email, phone } = errors;
    
    // Типизируем ошибки как массив строк
    const orderErrors = Object.values({ payment, address }).filter((i): i is string => !!i);
    const contactErrors = Object.values({ phone, email }).filter((i): i is string => !!i);

    orderForm.render({
        valid: !payment && !address,
        errors: orderErrors
    });

    contactsForm.render({
        valid: !email && !phone,
        errors: contactErrors
    });
});

// 5. Выбор способа оплаты (ФИКС СТИЛЕЙ КНОПОК)
events.on('payment:change', (data: { target: string }) => {
    buyerModel.setData({ payment: data.target as any });
    buyerModel.validate(); // Принудительно запускаем валидацию для кнопки "Далее"
    orderForm.render({ payment: data.target }); // Передаем значение для сеттера в Order
});

// 6. Ввод данных в формах
events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyerModel.setData({ [data.field]: data.value });
    buyerModel.validate(); // Обновляем состояние кнопок "на лету"
});

// 7. Управление модальными окнами
events.on('.basket:open', () => {
    modal.render({ content: basketView.render({}) });
});

events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

// 8. Финализация заказа
events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };

    api.orderProducts(orderData)
        .then((result: IOrderResult) => {
            const success = new Success(cloneTemplate('#success'), {
                onClick: () => {
                    modal.close();
                    basketModel.clear();
                    buyerModel.clear();
                }
            });

            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch(console.error);
});

// Управление скроллом
events.on('modal:open', () => document.body.classList.add('page_locked'));
events.on('modal:close', () => document.body.classList.remove('page_locked'));

// --- СТАРТ ---
api.getProductList()
    .then((items) => {
        productsModel.setItems(items);
    })
    .catch(console.error);