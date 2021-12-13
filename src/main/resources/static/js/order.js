import {changeOption, displayDropdown, displayWindow} from "./js.js";

let order = {
    data: function () {
        return {
            regions: [],
            countries: [],
            basket: [],
            total: 0,
            number: undefined,
            totalAmount: 0,
            maxCount: {},
        };
    },
    props: ['user', 'count', 'addToBasket'],
    created: function () {

        this.$http.get("/country/all").then(
            res => this.countries = JSON.parse(res.bodyText)
        );

        this.$http.get("/region/all").then(
            res => this.regions = JSON.parse(res.bodyText)
        );

        if (localStorage.user) {

            this.$http.post('/user/' + localStorage.user).then(
                res => {
                    this.user = JSON.parse(res.bodyText)
                }
            )
        } else {

            this.user = {}
        }

        let cookies = document.cookie.split('; ');

        for (let cookie of cookies) {

            if (cookie.startsWith('product')) {

                let records = cookie.split('product')[1];

                let id = records.split('=')[0];
                let count = records.split('=')[1];

                this.totalAmount += Number(count);

                if (count > 0) {

                    this.$http.get('/product/' + id).then(
                        product => {

                            this.basket.push({
                                product: JSON.parse(product.bodyText),
                                count: count,
                            });

                            this.total += JSON.parse(product.bodyText).price * count;
                        }
                    )
                }

                this.$http.get('/product/' + id + '/count').then(
                    result => this.maxCount[id.toString()] = JSON.parse(result.bodyText)
                );
            }
        }
    },
    methods: {
        displayContacts: function () {
            document.querySelector('.order-body').querySelector('p').textContent = 'Контактные данные';
            document.querySelector('.content-table').style.display = 'none';
            document.querySelector('.content-contacts').style.display = 'flex';
            document.querySelector('.order-body').style.marginBottom = '364px';
            document.querySelector('.contact-data').classList.add('choosen');
            document.querySelector('.start').classList.remove('choosen');

        },
        displayOrder: function () {
            document.querySelector('.order-body').querySelector('p').textContent = 'Заказ успешно создан';
            document.querySelector('.content-shipping').style.display = 'none';
            document.querySelector('.content-order').style.display = 'flex';
            document.querySelector('.order-body').style.marginBottom = '729px';
            document.querySelector('.end').classList.add('choosen');
            document.querySelector('.shipping-data').classList.remove('choosen')
        },
        displayWindow: function (windowClass) {

            displayWindow(windowClass);
        },
        displayDropdown: function (e) {
            displayDropdown(e)
        },
        changeOption: function (e) {
            changeOption(e)
        },
        changeCount: function (product, prev, next, d) {

            if (next !== undefined) {

                if (next > prev)
                    this.total += product.price;

                if (next < prev && d === undefined)
                    this.total -= product.price;

                this.addToBasket(product, Number(prev), Number(next));
            }
        },
        deleteItem: function (product, count, e) {

            if (count > 0)
                this.changeCount(product, 1, 0, 'd');

            this.total -= count * product.price;

            let productRow = e.currentTarget.parentNode;
            productRow.parentNode.removeChild(productRow); // delete the .product-row elem from basket
        },
        displayPasswords: function (e) {

            let password = document.querySelector('#order-password');
            let password1 = document.querySelector('#order-password1');

            if (e.currentTarget.value !== '') {

                password.parentElement.style.opacity = '1';
                password1.parentElement.style.opacity = '1';

            } else {

                password.parentElement.style.opacity = '0.3';
                password1.parentElement.style.opacity = '0.3';
            }
        },
        validateOrderContacts: function () {

            let ok = true;

            let name = document.querySelector('#order-name');
            let surname = document.querySelector('#order-surname');
            let patronymic = document.querySelector('#order-patronymic');
            let phone = document.querySelector('#order-phone');
            let email = document.querySelector('#order-email');
            let password = document.querySelector('#order-password');
            let password1 = document.querySelector('#order-password1');

            let order = {
                name: name.value,
                surname: surname.value,
                patronymic: patronymic.value,
                phone: phone.value,
                email: email.value,
                password: password.value,
                password1: password1.value,
            }

            this.$http.post('/order/validate/contacts', order).then(
                res => {

                    let validationMap = JSON.parse(res.bodyText);

                    if (validationMap.name !== undefined) {

                        ok = false;
                        name.parentElement.classList.add('incorrect');
                        name.previousElementSibling.textContent = validationMap.name;

                    } else {

                        name.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.surname !== undefined) {

                        ok = false;
                        surname.parentElement.classList.add('incorrect');
                        surname.previousElementSibling.textContent = validationMap.surname;

                    } else {

                        surname.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.patronymic !== undefined) {

                        ok = false;
                        patronymic.parentElement.classList.add('incorrect');
                        patronymic.previousElementSibling.textContent = validationMap.patronymic;

                    } else {

                        patronymic.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.phone !== undefined) {

                        ok = false;
                        phone.parentElement.classList.add('incorrect');
                        phone.previousElementSibling.textContent = validationMap.phone;

                    } else {

                        phone.parentElement.classList.remove('incorrect');
                    }

                    let boolPassword = true;

                    if (validationMap.password !== undefined) {

                        ok = false;
                        boolPassword = false;
                        password.previousElementSibling.textContent = validationMap.password;

                    } else {

                        password.previousElementSibling.textContent = '';
                    }

                    if (validationMap.user !== undefined) {

                        ok = false;
                        boolPassword = false;
                        email.parentElement.classList.add('incorrect');
                        email.previousElementSibling.textContent = validationMap.user;

                    } else {

                        email.parentElement.classList.remove('incorrect');
                    }

                    if (boolPassword) {

                        password.parentElement.classList.remove('incorrect');
                        password1.parentElement.classList.remove('incorrect');

                    } else {

                        password.parentElement.classList.add('incorrect');
                        password1.parentElement.classList.add('incorrect');
                    }

                    if (ok) {

                        document.querySelector('.order-body').querySelector('p').textContent = 'Доставка';
                        document.querySelector('.content-contacts').style.display = 'none';
                        document.querySelector('.content-shipping').style.display = 'flex';
                        document.querySelector('.order-body').style.marginBottom = '554px';
                        document.querySelector('.shipping-data').classList.add('choosen');
                        document.querySelector('.contact-data').classList.remove('choosen');
                    }
                }
            )
        },
        validateOrderShipping: function () {

            let ok = true;

            let region = document.querySelector('#order-region');
            let city = document.querySelector('#order-city');
            let street = document.querySelector('#order-street');
            let house = document.querySelector('#order-house');
            let flat = document.querySelector('#order-flat');

            let order = {
                region: region.value,
                city: city.value,
                street: street.value,
                house: house.value,
                flat: flat.value,
            }

            this.$http.post('/order/validate/shipping', order).then(
                res => {

                    let validationMap = JSON.parse(res.bodyText);

                    if (validationMap.region !== undefined) {

                        ok = false;
                        region.parentElement.classList.add('incorrect');
                        region.previousElementSibling.textContent = validationMap.region;
                        region.nextElementSibling.style.border = '1px solid #bd2121;';

                    } else {

                        region.parentElement.classList.remove('incorrect');
                        region.previousElementSibling.textContent = validationMap.region;
                        region.nextElementSibling.style.border = '1px solid #d3d3d3';
                    }

                    if (validationMap.city !== undefined) {

                        ok = false;
                        city.parentElement.classList.add('incorrect');
                        city.previousElementSibling.textContent = validationMap.city;

                    } else {

                        city.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.street !== undefined) {

                        ok = false;
                        street.parentElement.classList.add('incorrect');
                        street.previousElementSibling.textContent = validationMap.street;

                    } else {

                        street.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.house !== undefined) {

                        ok = false;
                        house.parentElement.classList.add('incorrect');
                        house.previousElementSibling.textContent = validationMap.house;

                    } else {

                        house.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.flat !== undefined) {

                        ok = false;
                        flat.parentElement.classList.add('incorrect');
                        flat.previousElementSibling.textContent = validationMap.flat;

                    } else {

                        flat.parentElement.classList.remove('incorrect');
                    }

                    if (ok) {

                        document.querySelector('.order-body').querySelector('p').textContent = 'Заказ успешно создан';
                        document.querySelector('.content-shipping').style.display = 'none';
                        document.querySelector('.content-order').style.display = 'flex';
                        document.querySelector('.order-body').style.marginBottom = '729px';
                        document.querySelector('.end').classList.add('choosen');
                        document.querySelector('.shipping-data').classList.remove('choosen')

                        let name = document.querySelector('#order-name');
                        let surname = document.querySelector('#order-surname');
                        let patronymic = document.querySelector('#order-patronymic');
                        let phone = document.querySelector('#order-phone');
                        let email = document.querySelector('#order-email');

                        order = {
                            name: name.value,
                            surname: surname.value,
                            patronymic: patronymic.value,
                            phone: phone.value,
                            email: email.value,
                            region: region.value,
                            city: city.value,
                            street: street.value,
                            house: house.value,
                            flat: flat.value,
                        }

                        let arr = document.querySelectorAll('input');

                        for (let a of arr)
                            if (a.name.startsWith('product') && Number(a.value) > 0)
                                order[a.name] = a.value;

                        this.$http.post('/order/save', order).then(
                            res => {
                                let id = JSON.parse(res.bodyText)
                                this.number = '0'.repeat((6 - id.toString().length)) + id
                            }
                        );
                    }
                }
            )
        }
    },
    template: `
    <div class="container order">
        <div class="row phases">
            <p id="stage">Оформление заказа</p>
            <div class="phase">
                <div class="start choosen"><p>Корзина</p></div>
                <div class="contact-data"><p>Контактные данные</p></div>
                <div class="shipping-data"><p>Доставка</p></div>
                <div class="end"><p>Завершение</p></div>
            </div>
        </div>
        <div class="frame order-body">
            <p>Корзина</p>
            <form class="content-table">
                <div class="row col-headings">
                    <p class="name">Наименование товара</p>
                    <p class="count">Количество</p>
                    <p class="price">Цена</p>
                </div>
                <div class="product-row"
                     v-for="item in basket"
                     :key="item.product.id">
                    <input type="hidden" 
                           :name="'product' + item.product.id" 
                           :value="item.count">
                    <div class="row">
                        <p class="name">{{ item.product.name }}</p>
                        <p class="mobile-article">Артикул: {{ item.product.article}}</p>
                        <div class="row">
                            <div class="count">
                                <button v-if="item.count > 0" 
                                        @click.prevent="changeCount(item.product, item.count, --item.count)">-</button>
                                <button v-else
                                        @click.prevent="changeCount(item.product, item.count)">-</button>
                                <div>{{ item.count }}</div>
                                <button v-if="item.count < maxCount[item.product.id.toString()]" 
                                        @click.prevent="changeCount(item.product, item.count, ++item.count)">+</button>
                                <button v-else
                                        @click.prevent="changeCount(item.product, item.count)">+</button>
                            </div>
                            <p class="price">{{ item.product.price }} тг</p>
                        </div>
                    </div>
                    <p>Артикул: {{ item.product.article }}</p>
                    <a href="#" @click="deleteItem(item.product, item.count, $event)">Удалить из корзины</a>
                    <div class="horizontal-line"></div>
                </div>
                <div class="row payment">
                    <div class="select">
                        <p>Способ оплаты</p>
                        <input name="payment" type="hidden">
                        <a @click="displayDropdown" class="select-button">Все категории</a>
                        <div class="dropdown">
                            <a @click="changeOption">Пункт 1</a>
                            <a @click="changeOption">Пункт 2</a>
                            <a @click="changeOption">Пункт 3</a>
                            <a @click="changeOption">Пункт 4</a>
                        </div>
                    </div>
                    <div>
                        <p>Итог к оплате:</p>
                        <p class="total">{{ total }} тг</p>
                    </div>
                </div>
                <input v-if="count > 0" type="button" class="button" value="Оформить заказ" @click="displayContacts">
            </form>
            <form class="row content-contacts">
                <div>
                    <div>
                        <p>Фамилия</p>
                        <p class="explanation"></p>
                        <input id="order-surname" class="grey-input" type="text" :value="user !== undefined ? user.surname : ''">
                    </div>
                    <div>
                        <p>Имя</p>
                        <p class="explanation"></p>
                        <input id="order-name" class="grey-input" type="text" :value= "user !== undefined ? user.name : ''">
                    </div>
                    <div>
                        <p>Отчество</p>
                        <p class="explanation"></p>
                        <input id="order-patronymic" class="grey-input" type="text" :value= "user !== undefined ? user.patronymic : ''">
                    </div>
                    <div>
                        <p>Телефон</p>
                        <p class="explanation"></p>
                        <input id="order-phone" class="grey-input" type="text" :value= "user !== undefined ? user.phone : ''">
                    </div>
                </div>
                <div class="vertical-line"></div>
                <div>
                    <div>
                        <p>Email</p>
                        <p class="explanation"></p>
                        <input @click="displayPasswords" id="order-email" class="grey-input" type="text">
                    </div>
                    <div style="opacity: 0.3" class="">
                        <p>Пароль</p>
                        <p class="explanation"></p>
                        <input id="order-password" class="grey-input" type="password"> 
                    </div>
                    <div style="opacity: 0.3" class="">
                        <p>Повторите пароль</p>
                        <p class="explanation"></p>
                        <input id="order-password1" class="grey-input" name="password1" type="password">
                    </div>
                </div>
                <input type="button" class="button" @click="validateOrderContacts" value="Подтвердить">
            </form>
            <form class="row content-shipping">
                <div>
                    <div class="select">
                        <p>Область</p>
                        <p class="explanation"></p>
                        <input id="order-region" type="hidden">
                        <a @click="displayDropdown" class="select-button">Все регионы</a>
                        <div class="dropdown">
                            <a v-if="" @click="changeOption">Все регионы</a>
                            <a v-for="region in regions" 
                               :key="region.id"
                               @click="changeOption">{{ region.name }}</a>
                        </div>
                    </div>
                    <div>
                        <p>Город и поселок</p>
                        <p class="explanation"></p>
                        <input id="order-city" class="grey-input" type="text" :value= "user !== undefined ? user.city : ''">
                    </div>
                </div>
                <div class="vertical-line"></div>
                <div>
                    <div>
                        <p>Улица</p>
                        <p class="explanation"></p>
                        <input id="order-street" class="grey-input" type="text" :value= "user !== undefined ? user.street : ''">
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>Дом</p>
                            <p class="explanation"></p>
                            <input id="order-house" class="grey-input" type="text" :value= "user !== undefined ? user.house : ''">
                        </div>
                        <div class="col">
                            <p>Квартира</p>
                            <p class="explanation"></p>
                            <input id="order-flat" class="grey-input" type="text" :value= "user !== undefined ? user.flat : ''">
                        </div>
                    </div>
                </div>
                <input type="button" class="button" @click="validateOrderShipping" value="Оформить заказ">
            </form>
            <div class="row content-order">
                <div class="row">
                    <img src="/img/Group%208.svg">
                    <p>Заказ №{{ number }} был создан. Вы можете просмотреть список всех ваших заказов в личном кабинете.</p>
                </div>
                <router-link v-if="user !== undefined" :to="'/user'">Перейти в личный кабинет</router-link>
                <a  v-else href="#" @click="displayWindow('login')">Войти в личный кабинет</a>
            </div>
        </div>
    </div>
    `,
}

export default order
