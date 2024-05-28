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
- src/styles/styles.scss — корневой файл стилей
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
- Интерфейс ProductDetails — определяет атрибуты одного товара. Массив ProductDetails[] представляет каталог товаров.
- Интерфейс OrderResponse — характеризует ответ сервера на успешное оформление заказа.
- Интерфейс OrderData — описывает структуру данных, отправляемых серверу при оформлении заказа.
- Интерфейс ApplicationState — содержит данные каталога, корзины и текущего заказа.

## Модели данных

Уровень MODEL:
(Этот уровень обеспечивает связь данных между сервером и пользовательским интерфейсом)
- Абстрактный класс EntityModel служит основой для создания объектов, которые хранят данные.
- Класс ProductDetails описывает модель данных каждого товара, храня его свойства.
- Класс ApplicationState отвечает за хранение и управление состоянием данных каталога, корзины и заказов. В него встроены методы для добавления товаров в корзину (addInBasket), удаления их оттуда (removeFromBasket), очистки текущего заказа (clearOrder) и корзины (clearBasket). Также предусмотрены функции для подсчета общей суммы заказа (getTotal), обновления каталога товаров (setCatalog), проверки наличия товара в корзине (checkBasket), перемещения данных из корзины в заказ (setOrder), а также для назначения способа оплаты (setPayment), адреса доставки (setAddress), электронной почты (setEmail) и телефонного номера (setPhone). Включены методы валидации данных в модальном окне заказа (validateOrder) и формы заказа (validateOrderForm).

Уровень VIEW:
(Этот уровень отвечает за визуализацию интерфейса пользователя)
- Класс UIBaseComponent – фундаментальный базовый класс для создания элементов интерфейса. Содержит методы для управления классами (addClass), текстовым содержимым (setText), состоянием доступности элемента (setDisabled), видимостью (setHidden и setVisible) и для установки изображений (setImage).
- Класс ProductCard предназначен для визуализации продуктов. Оснащён функциями, позволяющими назначить заголовок (setTitle), описание (setDescription), изображение (setImage) и ценник (setPrice). Если цена не указана, метод автоматически дезактивирует кнопку покупки. Также позволяет задавать и категорию продукции (setCategory), применяя соответствующий класс для стилизации.
- Класс BasketCard специализируется на отображении товаров в корзине и включает методы для задания названия товара (setTitle), его порядкового номера в списке (setIndex) и цены (setPrice).
- Класс Basket отражает содержимое покупательской корзины.
- Класс MainPage служит для отрисовки основной страницы, позволяет устанавливать количество товаров в корзине (setCounter), перечень продуктов (setCatalog) и блокировать прокрутку страницы при всплывании модальных окон (setLocked).
- Класс Modal используется для создания модальных окон, включает функционал для назначения содержимого окна (setContent), его открытия (open) и закрытия (close), а также базовый метод отрисовки (render), который активизирует событие открытия окна.
- Класс ValidationForm отвечает за реализацию механизма валидации форм, имеет методы для отключения кнопки отправки (setValid) и вывода сообщений об ошибках (setErrors).
- Класс DeliveryOrder предназначен для отображения формы с выбором адреса доставки и способа оплаты, позволяет управлять визуальным состоянием элементов (setClass) и задавать адрес доставки (setAddress).
- Класс UserContacts служит для визуализации формы контактных данных пользователя, с методами для задания номера телефона (setPhone) и адреса электронной почты (setEmail).
- Класс SuccessOrder отображает уведомление о успешном оформлении заказа.

Уровень PRESENTER:
(Задача этого уровня – управление взаимодействием с данными, исходящими от сервера).
- Класс EventManager является узлом управления событиями в приложении. Он предоставляет методы для подписки на события (on), отписки (off), а также для генерации событий (triggerEvent), что позволяет вызвать зарегистрированные обработчики при их наступлении. Добавлены методы onAll и offAll для глобальной работы со всеми событиями и обработчиками trigger, упрощающие управление событийным потоком.
- Класс Api служит в качестве базового класса для всех операций общения с сервером, используя HTTP-методы get и post для приема и отправки данных.
- Класс ProductsAPI специально предназначен для работы с данными продуктов, получаемых с сервера. В его функционал входят методы getProductsList для получения полного списка товаров, getProductItem для детальной информации о конкретном товаре и submitOrder для соответствующего оформления заказа и отправки его на сервер. 