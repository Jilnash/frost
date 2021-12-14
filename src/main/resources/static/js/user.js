import {changeOption, displayDropdown} from "./js.js";

let user = {
    data: function () {
        return {
            countries: [],
            regions: [],
            country: undefined,
            region: undefined,
            orderPrices: {},
        };
    },
    props: ['user'],
    created: function () {

        this.$http.get("/country/all").then(
            res => this.countries = JSON.parse(res.bodyText)
        )

        if (localStorage.user) {

            this.$http.post('/user/' + localStorage.user).then(
                res => {
                    this.user = JSON.parse(res.bodyText)

                    for (let o of this.user.orders)
                        this.$http.get('/order/' + o.id + '/price').then(
                            result => this.orderPrices[o.id.toString()] = JSON.parse(result.bodyText)
                        );

                    if (this.user.country)
                        this.country = this.user.country.name;

                    if (this.user.region)
                        this.region = this.user.region.name;

                    let country = '?country=';

                    if (this.user.country.name)
                        country += this.user.country.name
                    else
                        country = ''

                    this.$http.get("/region/all" + country).then(
                        res => this.regions = JSON.parse(res.bodyText)
                    )
                }
            )
        }
    },
    methods: {
        displayMyOrders: function (e) {
            document.querySelector('.content').querySelector('p').textContent = 'История заказов'
            document.querySelector('.my-orders').classList.add('choosen');
            document.querySelector('.my-contacts').classList.remove('choosen');
            document.querySelector('.my-shippings').classList.remove('choosen');
            document.querySelector('.content').style.marginBottom = '303px';
            document.querySelector('.my-order').style.display = 'block';
            document.querySelector('.my-contact').style.display = 'none';
            document.querySelector('.my-shipping').style.display = 'none';
        },
        displayMyContacts: function (e) {
            document.querySelector('.content').querySelector('p').textContent = 'Контактный данные'
            document.querySelector('.my-orders').classList.remove('choosen');
            document.querySelector('.my-contacts').classList.add('choosen');
            document.querySelector('.my-shippings').classList.remove('choosen');
            document.querySelector('.content').style.marginBottom = '518px';
            document.querySelector('.my-order').style.display = 'none';
            document.querySelector('.my-contact').style.display = 'flex';
            document.querySelector('.my-shipping').style.display = 'none';
        },
        displayMyShippings: function (e) {
            document.querySelector('.content').querySelector('p').textContent = 'Адрес доставки'
            document.querySelector('.my-orders').classList.remove('choosen')
            document.querySelector('.my-contacts').classList.remove('choosen')
            document.querySelector('.my-shippings').classList.add('choosen')
            document.querySelector('.content').style.marginBottom = '518px';
            document.querySelector('.my-order').style.display = 'none';
            document.querySelector('.my-contact').style.display = 'none';
            document.querySelector('.my-shipping').style.display = 'flex';
        },
        displayDropdown: function (e) {
            displayDropdown(e)
        },
        changeOption: function(e) {
            changeOption(e)
        },
        changeCountry: function (e) {

            let countryName = e.currentTarget.textContent;

            this.country = countryName;
            this.region = undefined;

            if (this.country.startsWith('Все'))
                this.country = undefined;

            this.$http.get('/region/all?country=' + countryName).then(
                res => this.regions = JSON.parse(res.bodyText)
            )

            this.changeOption(e);

            let region = document.querySelector('#user-region');

            region.value = '';
            region.nextElementSibling.textContent = 'Все регионы';

            this.regions = [];
        },
        changeRegion: function (e) {

            this.region = e.currentTarget.textContent;

            if (this.region.startsWith('Все'))
                this.region = undefined

            this.changeOption(e);
        },
        validateUserContacts: function () {

            let ok = true;

            let name = document.querySelector('#user-name');
            let surname = document.querySelector('#user-surname');
            let patronymic = document.querySelector('#user-patronymic');
            let email = document.querySelector('#user-email');
            let phone = document.querySelector('#user-phone');

            let user = {
                id: localStorage.user,
                name: name.value,
                surname: surname.value,
                patronymic: patronymic.value,
                email: email.value,
                phone: phone.value,
            }

            this.$http.post('/user/validate/contacts', user).then(
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

                    if (validationMap.email !== undefined) {

                        ok = false;
                        email.parentElement.classList.add('incorrect');
                        email.previousElementSibling.textContent = validationMap.email;

                    } else {

                        email.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.phone !== undefined) {

                        ok = false;
                        phone.parentElement.classList.add('incorrect');
                        phone.previousElementSibling.textContent = validationMap.phone;

                    } else {

                        phone.parentElement.classList.remove('incorrect');
                    }

                    if (ok)
                        this.$http.post('/user/contacts', user);
                }
            )
        },
        validateUserShipping: function () {

            let ok = true;

            let country = document.querySelector('#user-country');
            let region = document.querySelector('#user-region');
            let city = document.querySelector('#user-city');
            let street = document.querySelector('#user-street');
            let house = document.querySelector('#user-house');
            let flat = document.querySelector('#user-flat');

            let user = {
                id: localStorage.user,
                country: country.value,
                region: region.value,
                city: city.value,
                street: street.value,
                house: house.value,
                flat: flat.value,
            }

            this.$http.post('/user/validate/shipping', user).then(
                res => {

                    let validationMap = JSON.parse(res.bodyText);

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

                    if (ok)
                        this.$http.post('/user/shipping', user);
                }
            )
        }
    },
    template: `
    <div class="container account">
        <p>Личный кабинет</p>
        <div class="row">
            <div class="menu">
                <div class="choosen my-orders" @click="displayMyOrders"></div>
                <div class="my-contacts" @click="displayMyContacts"></div>
                <div class="my-shippings" @click="displayMyShippings"></div>
            </div>
            <div class="content">
                <p>История заказов</p>
                <div class="body">
                    <div class="my-order">
                        <div class="headings row">
                            <p class="id">Номер заказа</p>
                            <p class="name">Наименования товара</p>
                            <p class="date">Дата заказов</p>
                            <p class="price">Стоимость</p>
                        </div>
                        <div class="order-row">
                            <template v-for="order in user.orders">
                                <div class="horizontal-line"></div>
                                <div class="row">
                                    <div class="row">
                                        <p class="mobile-id">Номер заказа</p>
                                        <p class="id">№{{ '0'.repeat((6 - order.id.toString().length)) + order.id }}</p>
                                    </div>
                                    <div class="order-details">
                                        <p class="mobile-name">Наименования товара</p>
                                        <template v-for="content in order.orderContents">
                                            <p class="name">{{ content.orderProduct.name }}</p>
                                            <p class="count">{{ content.count }} X {{ content.orderProduct.price }} тг</p>
                                        </template>
                                    </div>
                                    <div class="row">
                                        <p class="mobile-date">Дата заказа</p>
                                        <p class="date">{{ order.createdAt.split('T')[0].split('-').reverse().join('.') }}</p>
                                    </div>
                                    <div class="row">
                                        <p class="mobile-price">Стоимость</p>
                                        <p class="price">{{ orderPrices[order.id.toString()] }} тг</p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <form class="row my-contact">
                        <div>
                            <div>
                                <p>Фамилия</p>
                                <p class="explanation"></p>
                                <input id="user-surname" class="grey-input" type="text" :value="user.surname">
                            </div>
                            <div>
                                <p>Имя</p>
                                <p class="explanation"></p>
                                <input id="user-name" class="grey-input" type="text" :value="user.name">
                            </div>
                            <div>
                                <p>Отчество</p>
                                <p class="explanation"></p>
                                <input id="user-patronymic" class="grey-input" type="text" :value="user.patronymic">
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>Email</p>
                                <p class="explanation"></p>
                                <input id="user-email" class="grey-input" type="text" :value="user.email">
                            </div>
                            <div>
                                <p>Телефон</p>
                                <p class="explanation"></p>
                                <input id="user-phone" class="grey-input" type="text" :value="user.phone">
                            </div>
                            <router-link :to="'/newpassword'">Изменить пароль</router-link>
                        </div>
                        <input @click="validateUserContacts" type="button" class="button" value="Сохранить изменения">
                    </form>
                    <form class="row my-shipping">
                        <div>
                            <div class="select">
                                <p>Страна</p>
                                <p class="explanation"></p>
                                <input id="user-country" type="hidden" :value="!country ? '': country">
                                <a v-if="!country" 
                                   @click="displayDropdown" class="select-button">Все страны</a>
                                <a v-else
                                   @click="displayDropdown" class="select-button">{{ country }}</a>
                                <div class="dropdown">
                                    <a v-if="country" @click="changeCountry">Все страны</a>
                                    <a v-for="country in countries" 
                                       :key="country.id"
                                       @click="changeCountry">{{ country.name }}</a>
                                </div>
                            </div>
                            <div class="select">
                                <p>Регион / Область</p>
                                <p class="explanation"></p>
                                <input id="user-region" type="hidden" :value="!region ? '': region">
                                <a v-if="!region"
                                   @click="displayDropdown" class="select-button">Все регионы</a>
                                <a v-else
                                   @click="displayDropdown" class="select-button">{{ region }}</a>
                                <div class="dropdown">
                                    <a v-if="!country">Выберите страну</a>
                                    <template v-else>
                                        <a v-if="region" @click="changeRegion">Все регионы</a>
                                        <a v-for="region in regions" 
                                           :key="region.id"
                                           @click="changeRegion">{{ region.name }}</a>
                                    </template>
                                </div>
                            </div>
                            <div>
                                <p>Город или поселок</p>
                                <p class="explanation"></p>
                                <input id="user-city" class="grey-input x" type="text" :value="user.city">
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>Улица</p>
                                <p class="explanation"></p>
                                <input id="user-street" class="grey-input" type="text" :value="user.street">
                            </div>
                            <div>
                                <p>Дом</p>
                                <p class="explanation"></p>
                                <input id="user-house" class="grey-input" type="text" :value="user.house">
                            </div>
                            <div>
                                <p>Квартира</p>
                                <p class="explanation"></p>
                                <input id="user-flat" class="grey-input" type="text" :value="user.flat">
                            </div>
                        </div>
                        <input @click="validateUserShipping" type="button" value="Сохранить изменения" class="button">
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
}

export default user
