import {closeWindows, displayWindow} from "./js.js";

let navbar = {
    props: ['search', 'user', 'count', 'login', 'logout'],
    methods: {
        displayWindow: function (windowClass) {

            displayWindow(windowClass);
        },
        closeWindows: function () {
            closeWindows();

            document.querySelector('#mobile-auth').style.display = 'none';
            document.querySelector('#mobile-auth').style.left = '132px';
        },
        displayMobileSearch: function (e) {
            document.querySelector('#mobile-search').style.display = 'block';
            document.querySelector('#mobile-search').style.right = '-62px';
        },
        hideMobileSearch: function (e) {
            document.querySelector('#mobile-search').style.display = 'none';
            document.querySelector('#mobile-search').style.right = '-405px';
        },
        displayMobileAuth: function (e) {
            document.querySelector('#mobile-auth').style.display = 'flex'
            document.querySelector('#mobile-auth').style.left = '-188px'
        },
        reg: function (e) {

            let ok = true;

            let name = document.querySelector('#reg-name');
            let surname = document.querySelector('#reg-surname');
            let email = document.querySelector('#reg-email');
            let password1 = document.querySelector('#reg-password1');
            let password2 = document.querySelector('#reg-password2');

            let user = {
                name: name.value,
                surname: surname.value,
                email: email.value,
                password: password1.value,
            };

            this.$http.post('/user/validate', user).then(
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

                    if (validationMap.email !== undefined) {

                        ok = false;
                        email.parentElement.classList.add('incorrect');
                        email.previousElementSibling.textContent = validationMap.email;

                    } else {

                        email.parentElement.classList.remove('incorrect');
                    }

                    if (password1.value !== password2.value) {

                        ok = false;
                        password1.parentElement.classList.add('incorrect');
                        password2.parentElement.classList.add('incorrect');
                        password1.previousElementSibling.textContent = 'Пароли должны совпадать';

                    } else {

                        if (validationMap.password !== undefined) {

                            ok = false;
                            password1.parentElement.classList.add('incorrect');
                            password2.parentElement.classList.add('incorrect');
                            password1.previousElementSibling.textContent = validationMap.password;

                        } else {

                            password1.parentElement.classList.remove('incorrect');
                            password2.parentElement.classList.remove('incorrect');
                        }
                    }

                    if (ok) {

                        this.$http.post('/user/reg', user);
                        closeWindows();
                    }
                }
            );
        },
    },
    template: `
        <div>
            <div class="navbar">
                <div class="container row navbar-body">
                    <router-link :to="'/'">
                        <img id="logo" src="/img/Frost%20logo.svg">
                        <div id="mobile-logo">
                            <img src="/img/Frost%20mobile%20logo%201.svg">
                            <img src="/img/Frost%20mobile%20logo%202.svg">
                        </div>
                    </router-link>
                    <div class="contacts">
                        <div class="row">
                            <p>г. Нур-Султан</p>
                            <p class="phone">+7 707 511 53 11</p>
                        </div>
                        <div class="row" style="margin-top: 6px">
                            <p>г. Алматы</p>
                            <p class="phone">+7 707 809 82 17</p>
                        </div>
                    </div>
                    <form class="row search">
                        <input @change="search" id="pattern" type="text" placeholder="Поиск по каталогу ...">
                        <img @click="search" src="/img/Group%209.svg">
                    </form>
                    <div v-if="user === undefined" class="col auth">
                        <a href="#" @click="displayWindow('login')">Вход в личный кабинет</a>
                        <a href="#" @click="displayWindow('reg')" style="margin-top: 6px">Зарегистрироваться</a>
                    </div>
                    <div v-else class="col auth">
                        <router-link v-if="user.role.id === 2" :to="'/user'">Личный кабинет</router-link>
                        <router-link v-else :to="'/admin'">Личный кабинет</router-link>
                        <a href="#" @click="logout" style="margin-top: 6px">Выйти</a>
                    </div>
                    <router-link :to="'/order'" class="basket">
                        <img src="/img/Group%202.svg">
                        <div v-if="count > 0" class="count">{{ count }}</div>
                    </router-link>
                    <div class="row mobile-menu">
                        <div class="mobile-auth">
                            <img @click="displayMobileAuth" src="/img/Group%204.svg">
                            <div v-if="user === undefined" class="row" id="mobile-auth">
                                <a @click="displayWindow('login')" href="#">Вход</a>
                                <div></div>
                                <a @click="displayWindow('reg')" href="#">Зарегистрироваться</a>
                            </div>
                            <div v-else class="row" id="mobile-auth">
                                <router-link @click="closeWindows" :to="'/user'">Личный кабинет</router-link>
                                <div></div>
                                <a @click="logout">Выйти</a>
                            </div>
                        </div>
                        <form class="mobile-search">
                            <img @click="displayMobileSearch" src="/img/Group%203.svg">
                            <div id="mobile-search">
                                <input @change="search" id="pattern" type="text" placeholder="Поиск по каталогу...">
                                <img @click="hideMobileSearch" src="/img/Group%209.svg">
                            </div>
                        </form>
                        <router-link :to="'/order'" class="mobile-basket">
                            <img src="/img/mobile%20basket.svg">
                            <div v-if="count > 0" class="count">{{ count }}</div>
                        </router-link>
                    </div>
                </div>
                <div class="backdrop">
                    <div class="window login">
                        <img @click="closeWindows" src="/img/Vector%202.svg">
                        <h1>Вход в учетную запись</h1>
                        <form class="col" method="post" action="/user/login">
                            <div>
                                <p class="explanation">Неправильный email или пароль</p>
                                <input id="log-email" name="email" class="grey-input" type="text" placeholder="Адрес электронной почты">
                            </div>
                            <div>
                                <input id="log-password" name="password" class="grey-input" type="password" placeholder="Пароль">
                            </div>
                            <a class="forgot" href="#" @click="displayWindow('acrecovery')">Забыли пароль?</a>
                            <input @click.prevent="login" class="button" type="submit" value="Войти в учетную запись">
                            <a class="acc" href="#" @click="displayWindow('reg')">Создать новую учетную запись</a>
                        </form>
                    </div>
                    <div class="window reg">
                        <img @click="closeWindows" src="/img/Vector%202.svg">
                        <h1>Создать учетную запись</h1>
                        <form class="col" method="post" action="/reg">
                            <div>
                                <div class="col">
                                    <p class="explanation"></p>
                                    <input id="reg-name" class="grey-input" type="text" placeholder="Имя">
                                </div>
                                <div class="col">
                                    <p class="explanation"></p>
                                    <input id="reg-surname" class="grey-input" type="text" placeholder="Фамилия">
                                </div>
                            </div>
                            <div>
                                <p class="explanation"></p>
                                <input id="reg-email" class="grey-input" type="text" placeholder="Адрес электронной почты">
                            </div>
                            <div>
                                <p class="explanation"></p>
                                <input id="reg-password1" class="grey-input" type="password" placeholder="Парол">
                            </div>
                            <div>
                                <input id="reg-password2" class="grey-input" type="password" placeholder="Повторите Парол">
                            </div>
                            <input  @click.prevent="reg" class="button" type="submit" value="Зарегистрироваться">
                            <a class="acc" href="#" @click="displayWindow('login')">Войди в существующую учетную запись</a>
                        </form>
                    </div>
                    <div class="window acrecovery">
                        <img @click="closeWindows" src="/img/Vector%202.svg">
                        <h1>Восстановление пароля</h1>
                        <p>Для получения нового пароля необходимо вписать в поле ниже адрес электронной почты, указанный при
                            регистрации</p>
                        <form class="col">
                            <div>
                                <input class="grey-input" type="text" placeholder="Адрес электронной почты">
                            </div>
                            <input class="button" type="submit" value="Отправить подтверждение">
                            <a class="acc" href="#" @click="displayWindow('reg')">Создать новую учетную запись</a>
                        </form>
                    </div>
                </div>
            </div>
            <div class="row container mobile-contacts">
                <div>
                    <p>г. Нур-Султан</p>
                    <p class="phone">+7 707 809 82 17</p>
                </div>
                <div>
                    <p>г. Алматы</p>
                    <p class="phone">+7 707 511 53 11</p>
                </div>
            </div>
        </div>
    `,
}

export default navbar
