import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket'; 
import { Buyer } from './components/Models/Buyer'; 
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
// --- 1. Тестирование модели Products (Каталог) ---
// Создаем экземпляр класса Products
const products = new Products();
console.log('--- ТЕСТ: Класс Products ---');

// Сохраняем массив товаров из apiProducts.items
products.setItems(apiProducts.items);
console.log('Массив всех товаров из каталога:', products.getItems());

// Проверяем получение одного товара по id (берем id первого из списка)
const firstId = apiProducts.items[0].id;
console.log(`Товар по id (${firstId}):`, products.getItem(firstId));

// Сохраняем товар для подробного отображения (preview)
products.setPreview(apiProducts.items[0]);
console.log('Товар в режиме preview:', products.getPreview());


// --- 2. Тестирование модели Basket (Корзина) ---
// Создаем экземпляр класса Basket
const basket = new Basket();
console.log('--- ТЕСТ: Класс Basket ---');

// Добавляем пару товаров в корзину
basket.add(apiProducts.items[0]);
basket.add(apiProducts.items[1]);

console.log('Товары в корзине:', basket.getItems());
console.log('Количество товаров:', basket.getCount());
console.log('Общая стоимость всех товаров:', basket.getTotal());

// Проверка наличия товара в корзине по id
console.log('Первый товар в корзине?', basket.inBasket(apiProducts.items[0].id));

// Удаление товара и проверка остатка
basket.remove(apiProducts.items[0].id);
console.log('Товары после удаления одного:', basket.getItems());
console.log('Новая сумма корзины:', basket.getTotal());

// Удалеие всей корзины
basket.clear();
console.log('Товары в корзине после удаления всех товаров', basket.getItems())

// --- 3. Тестирование модели Buyer (Покупатель) ---
// Создаем экземпляр класса Buyer
const buyer = new Buyer();
console.log('--- ТЕСТ: Класс Buyer ---');

// Проверка валидации при пустых данных
console.log('Ошибки валидации (пустая модель):', buyer.validate());

// Сохранение данных (частично) через один общий метод setData
buyer.setData({ email: 'example@test.com', payment: 'card' });
console.log('Данные после частичного заполнения:', buyer.getData());
console.log('Ошибки после частичного заполнения:', buyer.validate());

// Полное заполнение данных для успешной проверки
buyer.setData({ address: 'ул. Ленина, д. 5', phone: '+79001112233' });
const errors = buyer.validate();
console.log('Ошибки после полного заполнения (должен быть {}):', errors);

// Очистка данных покупателя
buyer.clear();
console.log('Данные после очистки clear():', buyer.getData());

// Инициализация API
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

// Запрос данных с сервера
larekApi.getProductList()
    .then((items) => {
        // Сохраняем полученные данные в модель
        products.setItems(items);
        
        console.log('Данные успешно получены с сервера и сохранены в модель:');
        console.log(products.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при получении данных:', err);
    });