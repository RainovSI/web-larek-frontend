# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Архитектура данного проекта основана на паттерне MVP (Model-View-Presenter)

## Описание структур данных
- Интерфейс `IProductDetails` — определяет атрибуты одного товара. Массив ProductDetails[] представляет каталог товаров.
- Интерфейс `IOrderResponse` — характеризует ответ сервера на успешное оформление заказа.
- Интерфейс `IOrderData` — описывает структуру данных, отправляемых серверу при оформлении заказа.
- Интерфейс `IApplicationState` — содержит данные каталога, корзины и текущего заказа.
- Интерфейс `IBasketView` — описывает представление корзины, включая элементы и общую стоимость.
- Интерфейс `IDeliveryOrder` — описывает данные для заказа доставки.
- Интерфейс `IModalData` — описывает данные, отображаемые в модальном окне.
- Интерфейс `IBasketCard` — описывает карточку товара в корзине.
- Интерфейс `ICardActions` — описывает действия, связанные с карточкой товара.
- Интерфейс `ISuccessOrder` — описывает успешный заказ.
- Интерфейс `ISuccessOrderActions` — описывает действия при успешном заказе.
- Интерфейс `IUserContacts` — описывает контактные данные пользователя.
- Интерфейс `IFormState` — описывает состояние формы, включая валидность и ошибки.
- Интерфейс `IMainPage` — описывает главную страницу, включая счетчик, каталог и состояние блокировки.
- Тип `CatalogChangeEvent` — описывает событие изменения каталога.
- Тип `ICard` — объединяет атрибуты товара с дополнительными опциональными полями.

## Модели данных

### Уровень MODEL:
(Этот уровень обеспечивает связь данных между сервером и пользовательским интерфейсом)

#### Класс Model<T>
Абстрактный класс, представляющий общую модель данных с поддержкой событий. Используется для создания специфичных моделей данных, которые могут обновляться и уведомлять о своих изменениях.

Конструктор принимает:
- `initialData (Partial<T>)` — Начальные данные для модели.
- `events (EventEmitter)` — Объект для управления событиями.

Методы:
- `getData(): T` - Возвращает текущие данные модели.
- `updateData(newData: Partial<T>): void` - Обновляет данные модели новыми значениями.
- `emitChanges(event: string, payload?: object): void` - Вызывает событие с указанным именем и дополнительными данными.


#### Класс ApplicationStateModel
Класс, представляющий состояние приложения, включая каталог товаров, корзину и текущий заказ. Наследуется от абстрактного класса Model<T>

Конструктор наследуется от абстрактного класса Model<T>

Методы:
- `addInBasket(item: IProductDetails): void` - добавляет товар в корзину.
- `removeFromBasket(id: string): void` - удаляет товар из корзины по его идентификатору.
- `clearOrder(): void` - удаляет все данные текущего заказа.
- `clearBasket(): void` - полностью очищает корзину.
- `getTotal(): number` - возвращает общую стоимость товаров в корзине.
- `setCatalog(items: IProductDetails[]): void` - устанавливает каталог товаров.
- `checkBasket(item: IProductDetails): boolean` - проверяет наличие товара в корзине.
- `setOrder(orderData: OrderData): void` - сохраняет данные заказа.
- `setOrderField(field: keyof Partial<IUserContacts>, value: string): void` - Устанавливает значение указанного поля в заказе и валидирует форму заказа.
- `setPayment(itemPayment: PaymentMethod): void` - устанавливает информацию о платеже.
- `setAddress(itemAddress: string): void` - сохраняет адрес доставки для заказа.
- `setEmail(itemEmail: string): void` - сохраняет электронную почту пользователя для заказа.
- `setPhone(itemPhone: string): void` - устанавливает контактный номер телефона в заказе.
- `validateOrder(): void` - проверяет правильность данных заказа перед его оформлением.
- `validateOrderForm(): void` - валидирует данные формы заказа на корректность ввода.

### Уровень VIEW:
(Этот уровень отвечает за визуализацию интерфейса пользователя)

#### `Component<T>`
Абстрактный базовый класс, необходимый для создания компонентов пользовательского интерфейса. Обеспечивает общие функции для управления поведением и внешним видом DOM элементов. Служит базой для всех классов представления.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, в который будет встроен компонент.

Методы:
- `toggleClass(className: string, condition: boolean)` - Добавляет или удаляет класс элемента в зависимости от условия.
- `setText(element: HTMLElement, text: string)` - Устанавливает текст для элемента.
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - Устанавливает изображение и альтернативный текст для элемента `img`.
- `setDisabled(element: HTMLElement, disabled: boolean)` - Меняет атрибут `disabled` элемента.
- `setHidden(element: HTMLElement, hidden: boolean)` - Меняет видимость элемента, делая его невидимым.
- `setVisible(element: HTMLElement, visible: boolean)` - Меняет видимость элемента, делая его видимым.
- `render(data?: T)` - Отображает компонент, используя предоставленные данные.

#### `ProductCard`
Компонент для отображения информации о продукте. Включает функциональные возможности для установки заголовка, описания, изображения и цены продукта.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, в который компонент будет отображаться.

Методы:
- `set title(value: string)` - Устанавливает заголовок продукта.
- `set description(value: string)` - Устанавливает описание продукта.
- `set image(value: string)` - Устанавливает изображение продукта.
- `set price(value: number)` - Устанавливает цену продукта.
- `set category(value: string)` - Задает категорию продукта, применяя класс для стилизации.
- `set button(value: string)` - Устанавливает кнопку.

#### `BasketCard`
Компонент для визуализации отдельного товара в корзине покупателя.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, где будет отображаться карточка товара.

Методы:
- `set title(value: string)` - Задает название товара.
- `set index(value: number)` - Устанавливает порядковый номер товара в списке.
- `set price(value: number)` - Устанавливает цену товара.

#### `Basket`
Компонент для отображения общего содержимого корзины покупателя.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, который будет содержать корзину.

Методы:
- `set items(items: HTMLElement[])` - Устанавливает содержимое корзины.
- `set total(total: number)` - Устанавливает общую стоимость содержимого корзины.

#### `MainPage`
Компонент для отображения основной страницы магазина. Управляет показом корзины, каталога товаров и возможностью блокировки скролла страницы.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, где будет отображаться основная страница.

Методы:
- `set counter(value: number)` - Устанавливает количество товаров в корзине.
- `set catalog(items: HTMLElement[])` - Показывает перечень доступных продуктов.
- `set locked(value: boolean)` - Блокирует прокрутку страницы.

#### `Modal`
Компонент для создания и управления модальными окнами.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, где будет отображаться модальное окно.

Методы:
- `set content(value: HTMLElement | null)` - Устанавливает содержимое модального окна.
- `open()` - Открывает модальное окно.
- `close()` - Закрывает модальное окно.
- `render(data: IModalData): HTMLElement` - Генерирует разметку модального окна и активирует его отображение.

#### `ValidationForm`
Компонент для реализации функциональности валидации форм.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, где будет отображаться форма валидации.

Методы:
- `set valid(value: boolean)` - Активирует или деактивирует кнопку отправки формы, в зависимости от прохождения валидации.
- `set errors(value: string)` - Отображает ошибки валидации.

#### DeliveryOrder
Компонент, отвечающий за отображение интерактивной формы с выбором адреса доставки и способа оплаты. Позволяет пользователю ввести и подтвердить информацию, необходимую для доставки заказа.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, в который будет встроена форма доставки.

Методы:
- `setClass(name: string): void` - Добавляет или удаляет CSS класс у компонента в зависимости от условия.
- `set address(address: string)` - Устанавливает или обновляет поле адреса доставки в форме.

#### UserContacts
Компонент для представления и ввода контактных данных пользователя, таких как номер телефона и адрес электронной почты. Это позволяет пользователю удобно вносить и изменять свои контактные данные в процессе оформления заказа или в настройках профиля.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, в который встраивается форма контактов пользователя.

Методы:
- `set phone(value: string)` - Задает номер телефона пользователя в соответствующее поле формы.
- `set email(value: string)` - Задает адрес электронной почты пользователя в соответствующее поле формы.

#### SuccessOrder
Компонент, который отображает уведомление о том, что заказ успешно оформлен. Это дает пользователю подтверждение о завершении процесса покупки и может включать дополнительные инструкции или информацию о следующих шагах.

Конструктор принимает:
- `container (HTMLElement)` - DOM-элемент, в который будет встроено уведомление о успехе.

Методы:
- `setText(value: string)` - Выводит сообщение о успешном оформлении заказа и, при необходимости, дополнительной информацией для пользователя.

### Уровень PRESENTER:

#### Класс EventEmitter
Класс EventEmitter служит центральным диспетчером для управления событиями внутри приложения. Он позволяет компонентам подписываться на события, отписываться от них и инициировать новые, упрощая коммуникацию между различными частями системы.

Конструктор класса EventEmitter не принимает параметров.

Методы:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - Подписывает функцию на событие.
- `off(eventName: EventName, callback: Subscriber)` - Отписывает функцию от события.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - Инициирует событие, вызывая все подписанные функции-обработчики.
- `onAll(callback: (event: EmitterEvent) => void)` - Подписывает функции на все заданные в объекте события.
- `offAll()` - Отписывает функции от всех заданных в объекте событий.

#### Класс Api
Базовый класс Api предназначен для инкапсуляции логики HTTP-взаимодействия с сервером. От этого класса наследуются другие классы, реализующие специфичные для определенного типа данных запросы.

Конструктор:
- `constructor(baseURL: string)` - Принимает базовый URL сервера, с которым будет осуществляться взаимодействие.

Методы:
- `get(uri: string)` - Выполняет GET-запрос к указанному пути относительно baseURL, возможно с параметрами.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - Выполняет POST-запрос с телом запроса к указанному пути относительно baseURL.
- `handleResponse(response: Response): Promise<object>` - Обрабатывает полученный ответ от сервера.

#### Класс ProductsAPI
ProductsAPI является специализированным потомком класса Api, предназначенным для работы с товарами. Он обеспечивает взаимодействие с конечными точками API, относящимися к продуктам, и реализует действия, связанные с получением списка товаров, информации о товаре и отправкой заказа.

Конструктор:
- Конструктор наследуется от класса Api и может принимать baseURL для инициализации основных параметров API.

Методы:
- `getProductsList(): Promise<IProductDetails[]>` - Получает список всех товаров c сервера.
- `getProductItem(id: string): Promise<IProductDetails>` - Получает информацию о конкретном товаре по его идентификатору.
- `submitOrder(order: IOrderData): Promise<IOrderResponse>` - Отправляет данные заказа на сервер и возвращает его результат. 

## Об архитектуре

Архитектура данного проекта строится на основе принципов модели MVP (Model-View-Presenter), адаптированных для работы в веб-приложении. В такой архитектуре ключевую роль играет централизованное управление состоянием и взаимодействием через событийно-ориентированную модель.
Такая структура обеспечивает ряд преимуществ: четкое разделение ответственности между компонентами, гибкость в управлении состоянием, и удобство в тестировании всего приложения благодаря изоляции бизнес-логики от пользовательского интерфейса и обратной связи.

## Основные типы и интерфейсы

### Типы данных

#### Интерфейс IProductDetails
Определяет атрибуты одного товара. Массив `ProductDetails[]` представляет каталог товаров.

interface IProductDetails {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null
}

#### Интерфейс IOrderData
Описывает структуру данных, отправляемых серверу при оформлении заказа.

interface IOrderData {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

#### Интерфейс IOrderResponse
Характеризует ответ сервера на успешное оформление заказа.

interface IOrderResponse {
    id: string;
    total: number;
}

#### Интерфейс IApplicationState
Содержит данные каталога, корзины и текущего заказа.

interface IApplicationState {
    catalog: ProductDetails[];
    basket: string[];
    order: OrderData | null;
}

#### Интерфейс IBasketView
Описывает представление корзины, включая элементы и общую стоимость.

interface IBasketView {
    items: HTMLElement;
    total: number;

}
#### Интерфейс IDeliveryOrder
Описывает данные для заказа доставки.
interface IDeliveryOrder {
    payment: PaymentMethod;
    address: string;
}

#### Интерфейс IModalData
Описывает данные, отображаемые в модальном окне.

interface IModalData {
    content: HTMLElement | null;
}

#### Тип ICard
Объединяет атрибуты товара с дополнительными опциональными полями.

type ICard = IProductDetails & {
    button?: string;
    id?: string;
    description?: string;
};

#### Интерфейс IBasketCard
Описывает карточку товара в корзине.

interface IBasketCard {
    title: string;
    price: number;
}

#### Интерфейс ICardActions
Описывает действия, связанные с карточкой товара.

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

#### Интерфейс ISuccessOrder
Описывает успешный заказ.

interface ISuccessOrder {
    total: number;
}

#### Интерфейс ISuccessOrderActions
Описывает действия при успешном заказе.

interface ISuccessOrderActions {
    onClick: () => void;
}

#### Интерфейс IUserContacts
Описывает контактные данные пользователя.

interface IUserContacts {
    email: string;
    phone: string;
}

#### Интерфейс IFormState
Описывает состояние формы, включая валидность и ошибки.

interface IFormState {
    valid: boolean;
    errors: string[];
}

#### Тип CatalogChangeEvent
Описывает событие изменения каталога.

type CatalogChangeEvent = {
    catalog: IProductDetails[];
};

#### Интерфейс IMainPage
Описывает главную страницу, включая счетчик, каталог и состояние блокировки.

interface IMainPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}