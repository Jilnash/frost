let body = document.querySelector('body');
let windows = document.querySelectorAll('.window');

let displayWindow = function (windowClass) {

    body.style.overflow = 'hidden';

    let window = document.querySelector('.' + windowClass);
    let windows = document.querySelectorAll('.window');

    window.style.display = 'block';
    window.parentElement.style.display = 'block'; // .backdrop element

    for (let w of windows) {

        if (w !== window) {
            w.style.display = 'none';
        }
    }
}

let closeWindows = function () {

    body.style.overflow = 'unset';

    let backdrops = document.querySelectorAll('.backdrop');

    for (let b of backdrops) {
        b.style.display = 'none';
    }

    for (let w of windows) {
        w.style.display = 'none';
    }
}

let displayDropdown = function (e) {

    let parent = e.target.parentElement; // current .select element
    let current = e.currentTarget; // .select-button element

    let selects = document.querySelectorAll('.select');

    for (let select of selects) {

        if (parent === select) {

            if (parent.classList.contains('x')) {

                parent.classList.remove('x');
                current.style.background = '#f7f7f7';
                current.style.border = '1px solid #d3d3d3';

            } else {

                parent.classList.add('x');
                current.style.background = 'white';
                current.style.borderBottom = '1px solid white';
            }
        } else {

            select.classList.remove('x');

            let a = select.querySelector('a');

            a.style.background = '#f7f7f7';
            a.style.borderBottom = '1px solid #d3d3d3'
        }
    }
}

let changeOption = function (e) {

    let option = e.currentTarget.textContent; // option text
    let a = e.target.parentElement.previousElementSibling; // <a> select element
    let input = a.previousElementSibling; // input

    if (!option.startsWith('Все'))
        input.value = option;
    else
        input.value = '';

    a.classList.remove('x')

    a.textContent = option;
    a.style.backgroundColor = '#f7f7f7';
    a.style.borderBottom = '1px solid #d3d3d3';
}

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

                        this.$http.post('/reg', user);
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
                        <form class="col" method="post" action="/login">
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

let products = {
    data: function () {
        return {
            user: undefined,
            categories: [],
            brands: [],
            models: [],
            generations: [],
            category: undefined,
            brand: undefined,
            model: undefined,
            generation: undefined,
            bool: false,
        };
    },
    props: ['products', 'search', 'maxPage', 'currentPage'],
    created: function () {

        this.$http.get("/categories").then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get("/brands").then(
            res => this.brands = JSON.parse(res.bodyText)
        );

        let k;

        (window.innerWidth > 1260) ? k = 9 : k = 3;

        this.$http.get("/products").then(
            res => {
                let list = JSON.parse(res.bodyText);
                this.products = list.slice(0, k);
                this.maxPage = Math.ceil(list.length / k);
            }
        );

        this.currentPage = 1;
    },
    methods: {
        displayDropdown: displayDropdown,
        changeOption: changeOption,
        changeCategory: function (e) {

            this.changeOption(e);

            this.category = e.currentTarget.textContent;

            if (this.category.startsWith('Все'))
                this.category = undefined;

            this.search();
        },
        changeBrand: function (e) {

            let brandName = e.currentTarget.textContent;

            this.brand = brandName;

            if (this.brand.startsWith('Все'))
                this.brand = undefined;

            this.$http.get('/models?brand=' + brandName).then(
                res => this.models = JSON.parse(res.bodyText)
            );

            this.changeOption(e);

            let model = document.querySelector('#model');
            let generation = document.querySelector('#generation');

            model.value = '';
            model.nextElementSibling.textContent = 'Все модели';
            generation.value = '';
            generation.nextElementSibling.textContent = 'Все поколения';

            this.models = [];
            this.generations = [];

            this.search();
        },
        changeModel: function (e) {

            let modelName = e.currentTarget.textContent;

            this.model = modelName;

            if (this.model.startsWith('Все'))
                this.model = undefined;

            this.$http.get('/generations?model=' + modelName).then(
                res => this.generations = JSON.parse(res.bodyText)
            )

            this.changeOption(e);

            let generation = document.querySelector('#generation')

            generation.value = '';
            generation.nextElementSibling.textContent = 'Все поколения';

            this.generations = [];

            this.search();
        },
        changeGeneration: function (e) {

            this.generation = e.currentTarget.textContent;

            if (this.generation.startsWith('Все'))
                this.generation = undefined

            this.changeOption(e);

            this.search();
        },
        changePage: function (pageNum) {

            if (this.maxPage > 6) {
                this.bool = this.currentPage > 3 && this.currentPage < this.maxPage - 2
            }

            this.search(pageNum);
        },
    },
    template: `
    <div>
        <div class="row banner">
            <button id="left"></button>
            <div class="container row banner-body">
                <div class="col info">
                    <p>Компрессоры для</p>
                    <li>легковых автомобилей</li>
                    <li>грузовых автомобилей</li>
                    <li>спецтезники</li>
                    <li>комбайнов</li>
                </div>
                <img src="img/Compressor%203.png">
            </div>
            <button id="right"></button>
        </div>
        <div class="products">
            <div class="container frame filter">
                <div>
                    <div class="select" style="margin-bottom: 25px">
                        <p>Категория</p>
                        <input id="category" type="hidden" name="category">
                        <a @click="displayDropdown" class="select-button">Все категории</a>
                        <div class="dropdown">
                            <a v-if="category" 
                               @click="changeCategory">Все категории</a>
                            <a v-for="category in categories"
                               v-if="!category.deleted" 
                               :key="category.id" 
                               @click="changeCategory">{{ category.name }}</a>
                        </div>
                    </div>
                    <div class="select">
                        <p>Марка</p>
                        <input id="brand" type="hidden" name="brand">
                        <a @click="displayDropdown" class="select-button">Все марки</a>
                        <div class="dropdown">
                            <a v-if="brand"
                               @click="changeBrand">Все марки</a>
                            <a v-for="brand in brands" 
                               :key="brand.id"
                               @click="changeBrand">{{ brand.name }}</a>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="select" style="margin-bottom: 25px">
                        <p>Модель</p>
                        <input id="model" type="hidden" name="model">
                        <a @click="displayDropdown" class="select-button">Все модели</a>
                        <div class="dropdown">
                            <a v-if="!brand">Выберите марку</a>
                            <template v-else>
                                <a v-if="model"
                                   @click="changeModel">Все модели</a>
                                <a v-for="model in models"
                                   :key="model.id"
                                   @click="changeModel">{{ model.name }}</a>
                            </template>
                        </div>
                    </div>
                    <div class="select">
                        <p>Поколение</p>
                        <input id="generation" type="hidden">
                        <a @click="displayDropdown" class="select-button">Все поколения</a>
                        <div class="dropdown">
                            <a v-if="!model">Выберите модель</a>
                            <template v-else>
                                <a v-if="generation"
                                   @click="changeGeneration">Все поколения</a>
                                <a v-for="generation in generations"
                                   :key="generation.id"
                                   @click="changeGeneration">{{ generation.name }}</a>
                            </template>
                        </div>
                    </div>
                </div>
                <label for="in-stock" class="row">
                    <input @click="search" type="checkbox" id="in-stock">
                    <p>в наличии</p>
                </label>
            </div>
            <div class="container row product-list">
                    <div class="col frame product-item"
                         v-for="(product, index) in products"
                         :key="product.id"
                         :style= "(index + 1) % 3 === 0 ? 'margin-right: 0' : ''">
                        <img src="img/Заглушка.svg">
                        <p>{{ product.name }}</p>
                        <div>
                            <p>{{ product.price }} тг</p>
                            <router-link :to="'/products/' + product.id" class="button">Купить</router-link>
                        </div>
                    </div>
            </div>
            <div class="container row page-number">
            
                <div v-if="currentPage > 1"
                     @click="changePage(currentPage - 1)"
                     class="frame backward">
                    <img src="/img/Rectangle%202.2.svg">
                </div>
                
                <div v-if="currentPage > 3"
                     @click="changePage(1)" 
                     class="frame number">1</div>
                
                <div v-if="maxPage > 4 && currentPage > 3 || bool" 
                     class="ellipsis">...</div>
                
                <div v-if="currentPage === 3 || currentPage === maxPage && maxPage > 2"
                     @click="changePage(currentPage - 2)"
                     class="frame number">{{ currentPage - 2 }}</div>
                <div v-if="currentPage > 1"
                     @click="changePage(currentPage - 1)"
                     class="frame number">{{ currentPage - 1 }}</div>
                     
                <div class="frame number choosen">{{ currentPage }}</div>
                
                <div v-if="currentPage < maxPage"
                     @click="changePage(currentPage + 1)"
                     class="frame number">{{ currentPage + 1 }}</div>
                <div v-if="currentPage === maxPage - 2 || currentPage === 1 && maxPage > 2"
                     @click="changePage(currentPage + 2)"
                     class="frame number">{{ currentPage + 2 }}</div>
                
                <div v-if="maxPage > 4 && currentPage < maxPage - 2 || bool" 
                     class="ellipsis">...</div>
                     
                <div v-if="currentPage < maxPage - 2"
                     @click="changePage(maxPage)"
                     class="frame number">{{ maxPage }}</div>
                
                <div v-if="currentPage < maxPage"
                     @click="changePage(currentPage + 1)"
                     class="frame forward">
                    <img src="/img/Rectangle%202.1.svg">
                </div>
            </div>
        </div>
    </div>
    `,
}

let footer = {
    template: `
    <footer>
        <div class="container row footer-body">
            <div class="link">
                <img src="/img/Insta.svg">
                <p>autocondicioneriastana</p>
            </div>
            <div class="link">
                <img src="/img/Mail.png">
                <p>frostautofrost@gmail.com</p>
            </div>
            <div class="link">
                <img src="/img/Phone.png">
                <div>
                    <p class="city">г. Нур-Султан</p>
                    <p>+7 707 511 53 11</p>
                </div>
            </div>
            <div class="link">
                <img src="/img/Phone.png">
                <div>
                    <p class="city">г. Алматы</p>
                    <p>+7 707 809 82 17</p>
                </div>
            </div>
        </div>
    </footer>
    `,
}

let comments = Vue.component('comments', {
    props: ['comments', 'user', 'product'],
    methods: {
        displayWindow: function (windowClass) {

            displayWindow(windowClass)
        },
        comment: function (e) {

            let text = e.target.previousElementSibling;

            if (text.value.length > 0) {

                this.$http.post('/comment', {
                    user: this.user.id,
                    product: this.product.id,
                    text: text.value,
                })

                this.comments.unshift({
                    user: this.user,
                    text: text.value
                })

                text.value = '';
            }
        }
    },
    template: `
    <div class="product-comments">
        <p class="h3">Отзывы</p>
            <p v-if="user === undefined">
                Чтобы оставить отзыв <a href="#" @click="displayWindow('login')">войдите на сайт</a>
            </p>
            <form v-else class="col">
                <input class="grey-input" type="text" placeholder="Оставьте отзыв">
                <input @click.prevent="comment" type="submit" class="button" value="Оставить отзыв">
            </form>
            <div class="comment-list">
                <div class="comment" v-for="comment in comments" :key="comment.id">
                    <p class="name">
                        <b>
                            {{ comment.user.name }}
                            {{ comment.user.surname }}
                            {{ comment.user.patronymic }}
                        </b>
                    </p>
                    <p>{{ comment.text }}</p>
                </div>
            </div>
    </div>
    `
});

let product = {
    data: function () {
        return {
            product: {},
            c: 0,
            maxCount: 0,
            brands: [],
            comments: [],
        }
    },
    props: ['user', 'count', 'addToBasket'],
    created: function () {

        this.$http.get('/products/' + this.$route.params.id).then(
            res => {
                this.product = JSON.parse(res.bodyText);

                this.comments = this.product.comments.reverse()

                this.$http.get('/products/' + this.product.id + '/count').then(
                    result => this.maxCount = JSON.parse(result.bodyText)
                );
            }
        );

        this.$http.get('/products/' + this.$route.params.id + '/brands').then(
            res => this.brands = JSON.parse(res.bodyText)
        )

        if (localStorage.user) {

            this.$http.post('/user', {id: localStorage.user}).then(
                res => this.user = JSON.parse(res.bodyText)
            )
        }
    },
    methods: {
        displayWindow: function (windowClass) {

            displayWindow(windowClass)
        },
        displayWindowAndAddToBasket: function () {

            displayWindow('basket-icon');

            let cookies = document.cookie.split('; ');

            for (let i = 0; i < cookies.length; i++) {

                if (cookies[i].startsWith('product' + this.product.id)) {

                    let records = cookies[i].split('product')[1];

                    let count = records.split('=')[1];
                    this.c = count;

                    return;
                }
            }

            if (this.maxCount > 0)
                this.addToBasket(this.product, this.c, ++this.c);
        },
        closeWindows: closeWindows,
        displayChild: function (e) {

            let parent = e.target.parentElement;

            if (parent.classList.contains('x'))
                parent.classList.remove('x')
            else
                parent.classList.add('x')
        },
    },
    template: `
    <div>
        <div class="container product">
            <div class="row desktop">
                <div class="left">
                    <div class="product-imgs">
                        <img class="frame main-img" src="/img/5003-01.png">
                        <div class="row all-imgs">
                            <div class="frame">
                                <img src="/img/5003-01.png">
                            </div>
                            <div class="frame">
                                <img src="/img/5003-02.png">
                            </div>
                            <div class="frame">
                                <img src="/img/5003-03.png">
                            </div>
                            <div class="frame">
                                <img src="/img/5003-04.png">
                            </div>
                        </div>
                    </div>
                    <div class="compatable">
                        <p>Применим к автомобилям:</p>
                        <div class="grey-frame">
                        
                            <div class="brand" v-for="b of brands" :key="b.id">
                                 
                                 <p class="parent" @click="displayChild">{{ b.name }}</p>
                                 
                                 <div class="model" v-for="m of b.models" :key="m.id">
                                      
                                      <div v-for="g of m.generations" :key="g.id">
                                          <p class="parent" @click="displayChild">
                                             {{ m.name }} {{ g.name }}
                                          </p>
                                          
                                          <div class="type" v-for="t of g.types">
                                            <p>{{ t.name }}</p>
                                          </div>
                                      </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="product-info">
                        <div class="product-text">
                            <p class="h3">{{ product.name }}</p>
                            <p><b>Артикул: </b>{{ product.article }}</p>
                            <p><b>Производитель: </b>{{ product.manufacturer }}</p>
                            <p class="descr"><b>Описание: </b>{{ product.description }}</p>
                        </div>
                        <div class="product-price">
                            <p><b>{{ product.price }} тг</b></p>
                            <div :class="(maxCount < 1) ? 'not' : ''" class="in-stock">
                                <p v-if="maxCount > 0" class="text"><b>в наличии</b></p>
                                <p v-else class="text"><b>нет в наличии</b></p>
                                <p v-if="maxCount > 0"
                                   v-for="instock in product.instocks"
                                   :key="instock.id">
                                   
                                   г. {{ instock.stock.name }}
                                </p>
                            </div>
                            <a href="#" class="button" @click="displayWindowAndAddToBasket">Купить</a>
                        </div>
                    </div>
                    <comments :user="user" :comments="comments" :product="product"></comments>
                </div>
            </div>
            <div class="col mobile-product">
                <p class="product-name h3">{{ product.name }}</p>
                <div class="product-imgs">
                    <img class="frame main-img" src="/img/5003-01.png">
                    <div class="row all-imgs">
                        <div class="frame">
                            <img src="/img/5003-01.png">
                        </div>
                        <div class="frame">
                            <img src="/img/5003-02.png">
                        </div>
                        <div class="frame">
                            <img src="/img/5003-03.png">
                        </div>
                        <div class="frame">
                            <img src="/img/5003-04.png">
                        </div>
                    </div>
                </div>
                <div class="product-price">
                    <p><b>{{ product.price }} тг</b></p>
                    <div :class="(maxCount < 1) ? 'not' : ''" class="in-stock">
                        <p v-if="maxCount > 0" class="text"><b>в наличии</b></p>
                        <p v-else class="text"><b>нет в наличии</b></p>
                        <p v-if="maxCount > 0"
                           v-for="instock in product.instocks"
                           :key="instock.id">
                                
                               г. {{ instock.stock.name }}
                        </p>
                    </div>
                    <a href="#" class="button" @click="displayWindowAndAddToBasket">Купить</a>
                </div>
                <div class="product-text">
                    <p><b>Артикул: </b>{{ product.article }}</p>
                    <p><b>Производитель: </b>{{ product.manufacturer }}</p>
                    <p class="descr"><b>Описание: </b>{{ product.description }}</p>
                </div>
                <div class="compatable">
                    <p>Применим к автомобилям:</p>
                    <div class="grey-frame">
                        <div class="brand" v-for="b of brands" :key="b.id">
                             
                             <p class="parent" @click="displayChild">{{ b.name }}</p>
                             
                             <div class="model" v-for="m of b.models" :key="m.id">
                                  
                                  <div v-for="g of m.generations" :key="g.id">
                                      <p class="parent" @click="displayChild">
                                         {{ m.name }} {{ g.name }}
                                      </p>
                                          
                                      <div class="type" v-for="t of g.types">
                                        <p>{{ t.name }}</p>
                                      </div>
                                  </div>
                             </div>
                        </div>
                    </div>
                </div>
                <comments :user="user" :comments="comments" :product="product"></comments>
            </div>
        </div>
        <div class="backdrop">
            <div class="window basket-icon">
                <img @click="closeWindows" src="/img/Vector%202.svg">
                <h1>Товар добавлен в корзину</h1>
                <p>{{ product.name }}</p>
                <form action="/">
                    <div class="row">
                        <p>Укажите количество: </p>
                        <div class="count">
                            <button v-if="c > 0" @click.prevent="addToBasket(product, c, --c)">-</button>
                            <button v-else @click.prevent="addToBasket(product, c)">-</button>
                            <div>{{ c }}</div>
                            <button v-if="c < maxCount" @click.prevent="addToBasket(product, c, ++c)">+</button>
                            <button v-else @click.prevent="addToBasket(product, c)">+</button>
                        </div>
                    </div>
                    <router-link :to="'/order'">
                        <input @click="closeWindows" type="submit" class="button" value="Оформить заказ">
                    </router-link>
                </form>
                <a href="#" @click="closeWindows">Продолжить выбор товаров</a>
            </div>
        </div>
    </div>
    `,
}

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

        this.$http.get("/countries").then(
            res => this.countries = JSON.parse(res.bodyText)
        );

        this.$http.get("/regions").then(
            res => this.regions = JSON.parse(res.bodyText)
        );

        if (localStorage.user) {

            this.$http.post('/user', {id: localStorage.user}).then(
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

                    this.$http.get('/products/' + id).then(
                        product => {

                            this.basket.push({
                                product: JSON.parse(product.bodyText),
                                count: count,
                            });

                            this.total += JSON.parse(product.bodyText).price * count;
                        }
                    )
                }

                this.$http.get('/products/' + id + '/count').then(
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
        displayDropdown: displayDropdown,
        changeOption: changeOption,
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

                        this.$http.post('/order', order).then(
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

        this.$http.get("/countries").then(
            res => this.countries = JSON.parse(res.bodyText)
        )

        if (localStorage.user) {

            this.$http.post('/user', {id: localStorage.user}).then(
                res => {
                    this.user = JSON.parse(res.bodyText)

                    for(let o of this.user.orders)
                        this.$http.get('/orders/' + o.id + '/price').then(
                            result => this.orderPrices[o.id.toString()] = JSON.parse(result.bodyText)
                        );

                    if(this.user.country)
                        this.country = this.user.country.name;

                    if(this.user.region)
                        this.region = this.user.region.name;

                    let country = '?country=';

                    if(this.user.country.name)
                        country += this.user.country.name
                    else
                        country = ''

                    this.$http.get("/regions" + country).then(
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
        displayDropdown: displayDropdown,
        changeOption: changeOption,
        changeCountry: function (e) {

            let countryName = e.currentTarget.textContent;

            this.country = countryName;

            if (this.country.startsWith('Все'))
                this.country = undefined;

            this.$http.get('/regions?country=' + countryName).then(
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

                    console.log("contacts");
                    console.log(user)
                    console.log(validationMap);

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
                                <input id="user-country" type="hidden"
                                       :value="!country ? '': country">
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
                                <input id="user-region" type="hidden" 
                                       :value="!region ? '': region">
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

let new_password = {
    methods: {
        validatePassword: function () {

            let prev = document.querySelector('#prev');
            let next = document.querySelector('#next');
            let again = document.querySelector('#again');

            let password = {
                id: localStorage.user,
                prev: prev.value,
                next: next.value,
                again: again.value,
            }

            this.$http.post('/new-password', password).then(
                res => {

                    if (res.bodyText === 'empty prev') {

                        prev.parentElement.classList.add('incorrect');
                        prev.previousElementSibling.textContent = 'Задайте пароль';

                        return;
                    }

                    prev.parentElement.classList.remove('incorrect');

                    if (res.bodyText === 'prev') {

                        prev.parentElement.classList.add('incorrect');
                        prev.previousElementSibling.textContent = 'Неверный пароль';

                        return;
                    }

                    prev.parentElement.classList.remove('incorrect');

                    if (res.bodyText === 'empty next') {

                        next.parentElement.classList.add('incorrect');
                        again.parentElement.classList.add('incorrect');
                        next.previousElementSibling.textContent = 'Задайте новый пароль'

                        return;
                    }

                    next.parentElement.classList.remove('incorrect');
                    again.parentElement.classList.remove('incorrect');

                    if (res.bodyText === 'next') {

                        next.parentElement.classList.add('incorrect');
                        again.parentElement.classList.add('incorrect');
                        next.previousElementSibling.textContent = 'Пароли должны совпадать'

                        return;
                    }

                    next.parentElement.classList.remove('incorrect');
                    again.parentElement.classList.remove('incorrect');
                }
            )
        }
    },
    template: `
    <form class="new-password">
        <p class="h">Изменение пароля</p>
        <div>
            <p>Старый пароль</p>
            <p class="explanation"></p>
            <input class="grey-input" id="prev" type="password">
        </div>
        <div>    
            <p>Новый пароль</p>
            <p class="explanation"></p>
            <input class="grey-input" id="next" type="password">
        </div>
        <div>
            <p>Повторите пароль</p>
            <p class="explanation"></p>
            <input class="grey-input" id="again" type="password">
        </div>
        <input type="button" @click="validatePassword" class="button" value="Изменить">
    </form>
    `,
}

let admin = {
    template: `
    <div class="container col admin">
        <router-link :to="'/admin/params'">Параметры</router-link>
        <router-link :to="'/admin/products'">Товары</router-link>
        <router-link :to="'/admin/orders'">Заказы</router-link>
    </div>
    `
}

let adminOrders = {
    data: function () {
        return {
            orders: [],
            statuses: [],
        }
    },
    created: function () {

        this.$http.get("/orders").then(
            res => this.orders = JSON.parse(res.bodyText)
        );

        this.$http.get("/statuses").then(
            res => this.statuses = JSON.parse(res.bodyText)
        );
    },
    methods: {
        search: function () {

            let id = document.querySelector('#id').value;
            let after = document.querySelector('#after').value;
            let before = document.querySelector('#before').value;
            let status = document.querySelector('#status').value;
            let phone = document.querySelector('#phone').value;

            if (id !== '')
                id = '&id=' + id;

            if (after !== '')
                after = '&after=' + after;

            if (before !== '')
                before = '&before=' + before;

            if (status !== '')
                status = '&status=' + status;

            if (phone !== '')
                phone = '&phone=' + phone;

            this.$http.get('/orders?p=p' + id + after + before + status + phone).then(
                res => this.orders = JSON.parse(res.bodyText)
            )
        },
        save: function (order) {

            let status = document.querySelector('#o' + order).value;

            this.$http.post('/order/status?order=' + order + '&status=' + status);
        }
    },
    template: `
    <div class="container admin-orders"> 
        <p class="h">Заказы</p>
        <div class="row order-filter">
            <div class="row">
                <p>ID</p>
                <input type="text" id="id" @change="search">
            </div>
            <div class="row">
                <p>После</p>
                <input type="date" id="after" @change="search">
            </div>
            <div class="row">
                <p>До</p>
                <input type="date" id="before" @change="search">
            </div>
            <select @change="search" id="status">
                <option value="" selected>Все</option>
                <option v-for="s in statuses" :value="s.id">{{ s.name }}</option>
            </select>
            <div class="row">
                <p>Телефон</p>
                <input type="text" id="phone" @change="search">
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Информация</td>
                    <td class="date">Дата</td>
                    <td>Статус</td>
                    <td>Телефон</td>
                    <td>Изменить</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="o in orders">
                    <td>{{ o.id }}</td>
                    <td>
                        <template v-for="c in o.orderContents">
                            <p class="name">
                                <router-link :to="'/admin/products/' + c.orderProduct.product.id">
                                    {{ c.orderProduct.product.name }}
                                </router-link>
                            <p class="count">{{ c.count }} X {{ c.orderProduct.price }} тг</p>
                        </p>
                        </template>
                    </td>
                    <td>{{ o.createdAt.split('T')[0] }}</td>
                    <td>
                        <select :id="'o' + o.id">
                            <option v-for="s in statuses"
                                    :selected="o.status.id === s.id"
                                    :value="s.id">{{ s.name }}</option>
                        </select>
                    </td>
                    <td>{{ o.phone }}</td>
                    <td>
                        <input type="submit" value="Изменить" @click="save(o.id)">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
}

let adminProducts = {
    props: ['search', 'products'],
    data: function () {
        return {
            categories: [],
            brands: [],
            models: [],
            generations: [],
            brand: false,
            model: false,
        }
    },
    created: function () {

        this.$http.get("/categories").then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get("/brands").then(
            res => this.brands = JSON.parse(res.bodyText)
        );

        this.$http.get("/products").then(
            res => this.products = JSON.parse(res.bodyText)
        );
    },
    methods: {
        changeValue: function (e) {

            e.currentTarget.firstChild.value = e.currentTarget.value
        },
        changeCategory: function (e) {

            this.changeValue(e)
            this.search();
        },
        changeBrand: function (e) {

            this.changeValue(e);

            let name = e.currentTarget.firstChild.value;

            (name === '') ?
                this.brand = false :
                this.brand = true;

            (this.brand) ?
                this.$http.get('/models?brand=' + name).then(
                    res => this.models = JSON.parse(res.bodyText)) :
                this.models = [];

            this.model = false;
            this.generations = [];

            document.querySelector('#model').value = '';
            document.querySelector('#generation').value = '';

            this.search();
        },
        changeModel: function (e) {

            this.changeValue(e);

            let name = e.currentTarget.firstChild.value;

            (name === '') ?
                this.model = false :
                this.model = true;

            (this.model) ?
                this.$http.get('/generations?model=' + name).then(
                    res => this.generations = JSON.parse(res.bodyText)) :
                this.generations = [];

            document.querySelector('#generation').value = '';

            this.search();
        },
        changeGeneration: function (e) {

            this.changeValue(e);
            this.search();
        },
    },
    template: `
    <div class="container col admin-products">
        <div>
            <router-link :to="'/admin/products/-1'">Добавить товар</router-link>
            <div style="margin-top: 25px">
                <select @change="changeCategory">
                    <input type="hidden" id="category">
                    <option selected="selected" value="">Все категории</option>
                    <option v-for="c in categories"
                            v-if="!c.deleted" 
                            :value="c.name">{{ c.name }}</option>
                </select>
                <select @change="changeBrand">
                    <input type="hidden" id="brand">
                    <option selected="selected" value="">Все марки</option>
                    <option v-for="b in brands"
                            :value="b.name">{{ b.name }}</option>
                </select>
                <select @change="changeModel">
                    <input type="hidden" id="model">
                    <option selected="selected" value="">Все модели</option>
                    <option v-if="!brand" value="">Выберите марку</option>
                    <option v-else v-for="m in models"
                            :value="m.name">{{ m.name }}</option>
                </select>
                <select @change="changeGeneration">
                    <input type="hidden" id="generation">
                    <option selected="selected" value="">Все поколения</option>
                    <option v-if="!model" value="">Выберите модель</option>
                    <option v-else 
                            v-for="g in generations"
                            :value="g.name">{{ g.name }}</option>
                </select>
                <input type="checkbox" id="in-stock" @click="search">
                <label for="in-stock">в наличии</label>
            </div>
        </div>
        <div class="col products"> 
            <table>
                <thead>
                    <tr>
                        <td class="id">ID</td>
                        <td>Имя</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in products">
                        <td class="id">{{ p.id }}</td>
                        <td class="name">
                            <router-link :to="'/admin/products/' + p.id">{{ p.name }}</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `
}

let adminProduct = {
    data: function () {
        return {
            product: {},
            categories: [],
            generations: [],
            containedG: [],
            stocks: [],
            containedS: [],
            count: [],
        }
    },
    methods: {
        alter: function () {

            let generations = [];

            for (let g of this.generations)
                if (g.checked)
                    generations.push(g.id)

            let stocks = '';

            for (let s of this.stocks) {
                let value = document.querySelector('#s' + s.id).value;

                if (value !== '')
                    stocks += s.id + ':' + value + ','
            }

            generations = generations.join(' ')

            let category = document.querySelector('#category')
            let name = document.querySelector('#name')
            let article = document.querySelector('#article')
            let manufacturer = document.querySelector('#manufacturer')
            let description = document.querySelector('#description')
            let price = document.querySelector('#price')

            let product = {
                id: this.product.id,
                category: category.value,
                name: name.value,
                article: article.value,
                manufacturer: manufacturer.value,
                description: description.value,
                price: price.value,
                generations: generations,
                stocks: stocks,
            }

            this.$http.post('/product/validate', product).then(
                res => {
                    let map = JSON.parse(res.bodyText);

                    let ok = true;

                    if (map.name !== undefined) {

                        ok = false;
                        name.parentElement.classList.add('incorrect');
                        name.previousElementSibling.textContent = map.name;

                    } else {

                        name.parentElement.classList.remove('incorrect');
                    }

                    if (map.article !== undefined) {

                        ok = false;
                        article.parentElement.classList.add('incorrect');
                        article.previousElementSibling.textContent = map.article;

                    } else {

                        article.parentElement.classList.remove('incorrect');
                    }

                    if (map.manufacturer !== undefined) {

                        ok = false;
                        manufacturer.parentElement.classList.add('incorrect');
                        manufacturer.previousElementSibling.textContent = map.manufacturer;

                    } else {

                        manufacturer.parentElement.classList.remove('incorrect');
                    }

                    if (map.description !== undefined) {

                        ok = false;
                        description.parentElement.classList.add('incorrect');
                        description.previousElementSibling.textContent = map.description;

                    } else {

                        description.parentElement.classList.remove('incorrect');
                    }

                    if (map.price !== undefined) {

                        ok = false;
                        price.parentElement.classList.add('incorrect');
                        price.previousElementSibling.textContent = map.price;

                    } else {

                        price.parentElement.classList.remove('incorrect');
                    }

                    if (ok)
                        this.$http.post('/product', product)
                }
            )
        }
    },
    created: function () {

        this.$http.get('/products/' + this.$route.params.id).then(
            res => {
                this.product = JSON.parse(res.bodyText)

                if (this.product.id !== null)
                    for (let g of this.product.productGenerations)
                        this.containedG.push(g.generation.id)

                if (this.product.id !== null)
                    for (let s of this.product.instocks) {
                        this.count.push(s.count)
                        this.containedS.push(s.stock.id)
                    }

                this.$http.get('/generations').then(
                    res => {
                        for (let g of JSON.parse(res.bodyText)) {

                            let b = false;

                            if (this.containedG.includes(g.id))
                                b = true;

                            this.generations.push(
                                {id: g.id, name: g.name, checked: b}
                            )
                        }
                    }
                );
            }
        );

        this.$http.get('/categories').then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get('/stocks').then(
            res => this.stocks = JSON.parse(res.bodyText)
        );
    },
    template: `
    <div class="container admin-product">
        <p class="h">Изображения</p>
        <div class="row imgs">
            <div>
                <img src="../img/5003-01.png">
                <a href="#">Удалить</a>
            </div>
            <div>
                <img src="../img/5003-02.png">
                <a href="#">Удалить</a>
            </div>
            <div>
                <img src="../img/5003-03.png">
                <a href="#">Удалить</a>
            </div>
            <div>
                <img src="../img/5003-04.png">
                <a href="#">Удалить</a>
            </div>
        </div>
        <p class="h">Основное</p>
        <div class="col">
            <select id="category">
                <option v-for="c in categories" 
                        :value="c.id" 
                        :selected="(product.id === null) ? 
                        (c.id === 1) : (c.id === product.category.id)" >{{ c.name }}</option>
            </select>
            <div>
                <p>Название</p>
                <p class="explanation"></p>
                <input type="text" id="name" :value="product.name">
            </div>
            <div>
                <p>Артикул</p>
                <p class="explanation"></p>
                <input type="text" id="article" :value="product.article">
            </div>
            <div>
                <p>Производитель</p>
                <p class="explanation"></p>
                <input type="text" id="manufacturer" :value="product.manufacturer">
            </div>
            <div>
                <p>Описание</p>
                <p class="explanation"></p>
                <input type="text" id="description" :value="product.description">
            </div>
            <div>
                <p>Цена</p>
                <p class="explanation"></p>
                <input type="text" id="price" :value="product.price">
            </div>
            <p class="h">Склады</p>
            <div class="col instock">
                <div v-for="s in stocks" class="row">
                    <p class="city">{{ s.name }}</p>
                    <input type="text" class="count" :id="'s' + s.id" :value="count[containedS.indexOf(s.id)]">
                </div>
            </div>
            <p class="h">Поколения</p>
            <div class="generations">
                <div v-for="g in generations">
                    <label :for="g.id">{{ g.name }}</label>
                    <input type="checkbox" :id="g.id" v-model="g.checked">
                </div>
            </div>
            <input type="submit" value="Сохранить изменения" @click="alter">
        </div>
    </div>
    `
}

let adminParams = {
    data: function () {
        return {
            categories: [],
            brands: [],
            stocks: [],
            countries: [],
        }
    },
    created: function () {

        this.$http.get('/categories').then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get('/brands').then(
            res => this.brands = JSON.parse(res.bodyText)
        );

        this.$http.get('/stocks').then(
            res => this.stocks = JSON.parse(res.bodyText)
        );

        this.$http.get('/countries').then(
            res => this.countries = JSON.parse(res.bodyText)
        );
    },
    methods: {
        displayInput: function (e) {

            let parent = e.currentTarget.parentElement.classList;

            if (parent.contains('create')) {

                parent.remove('create');
                e.currentTarget.textContent = 'Добавить';

            } else {

                parent.add('create');
                e.currentTarget.textContent = 'Отмена';
            }
        },
        save: function (param, id, parent, e) {

            let name = e.currentTarget.previousElementSibling.value;

            let res = confirm("Подтвердить изменения")

            if (res)
                this.$http.post('/param/?param=' + param +
                    '&name=' + name + '&id=' + id + '&parent=' + parent);
        },
        remove: function (param, id) {

            let res = confirm("Подтвердить изменения")

            if (res)
                this.$http.post('/' + param + '/delete' + '?id=' + id);
        }
    },
    template: `
    <div class="container col admin-params">
        <div class="categories">
            <p class="h">Категории</p>
            <a class="create-button" @click="displayInput">Добавить</a>
            <div class="input">
                <input type="text">
                <input type="submit" value="Добавить" @click="save('category', -1, -1, $event)">
            </div>
            <div class="category" v-for="c in categories">
                <input type="text" :value="c.name">
                <input v-if="!c.deleted" type="submit" value="Изменить" @click="save('category', c.id, -1, $event)">
                <input v-if="!c.deleted" type="submit" value="Удалить" @click="remove('category', c.id)">
                <input v-else type="submit" value="Восстановить" @click="save('category', c.id, -1, $event)">
            </div>
        </div>
        <div class="brands">
            <p class="h">Марки, модели, поколения</p>
            <a class="create-button" @click="displayInput">Добавить</a>
            <div class="input">
                <input type="text">
                <input type="submit" value="Добавить" @click="save('brand', -1, -1, $event)">
            </div>
            <div class="brand" v-for="b in brands">
                <input type="text" :value="b.name">
                <input type="submit" value="Изменить" @click="save('brand', b.id, -1, $event)">
                <input type="submit" @click="remove('brand', b.id)" value="Удалить">
                <div class="models">
                    <a class="create-button" @click="displayInput">Добавить</a>
                    <div class="input">
                        <input type="text">
                        <input type="submit" value="Добавить" @click="save('model', -1, b.id, $event)">
                    </div>
                    <div class="model" v-for="m in b.models">
                        <input type="text" :value="m.name">
                        <input type="submit" value="Изменить" @click="save('model', m.id, b.id, $event)">
                        <input type="submit" @click="remove('model', m.id)" value="Удалить">
                        <div class="generations">
                            <a class="create-button" @click="displayInput">Добавить</a>
                            <div class="input">
                                <input type="text">
                                <input type="submit" value="Добавить" @click="save('generation', -1, m.id, $event)">
                            </div>
                            <div class="generation" v-for="g in m.generations">
                                <input type="text" :value="g.name">
                                <input type="submit" value="Изменить" @click="save('generation', g.id, m.id, $event)">
                                <input type="submit" @click="remove('generation', g.id)" value="Удалить">
                                <div class="types">
                                    <a class="create-button" @click="displayInput">Добавить</a>
                                    <div class="input">
                                        <input type="text">
                                        <input type="submit" value="Добавить" @click="save('type', -1, g.id, $event)">
                                    </div>
                                    <div class="type" v-for="t of g.types">
                                        <input type="text" :value="t.name">
                                        <input type="submit" value="Изменить" @click="save('type', t.id, g.id, $event)">
                                        <input type="submit" @click="remove('type', t.id)" value="Удалить">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="instocks">
            <p class="h">Склады</p>
            <a class="create-button" @click="displayInput">Добавить</a>
            <div class="input">
                <input type="text">
                <input type="submit" value="Добавить" @click="save('stock', -1, -1, $event)">
            </div>
            <div class="instock" v-for="s in stocks">
                <input type="text" :value="s.name">
                <input type="submit" value="Изменить" @click="save('stock', s.id, $event)">
                <input type="submit" @click="remove('stock', s.id)" value="Удалить">
            </div>
        </div>
        <div class="countries">
            <p class="h">Страны, регионы</p>
            <a class="create-button" @click="displayInput">Добавить</a>
            <div class="input">
                <input type="text">
                <input type="submit" value="Добавить" @click="save('country', -1, -1, $event)">
            </div>
            <div class="country" v-for="c in countries">
                <input type="text" :value="c.name">
                <input type="submit" value="Изменить" @click="save('country', c.id, -1, $event)">
                <input type="submit" @click="remove('country', c.id)" value="Удалить">
                <div class="regions">
                    <a class="create-button" @click="displayInput">Добавить</a>
                    <div class="input">
                        <input type="text">
                        <input type="submit" value="Добавить" @click="save('region', -1, c.id, $event)">
                    </div>
                    <div class="region" v-for="r in c.regions">
                        <input type="text" :value="r.name">
                        <input type="submit" value="Изменить" @click="save('region', r.id, c.id, $event)">
                        <input type="submit" @click="remove('region', c.id)" value="Удалить">
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

let router = new VueRouter({
    routes: [
        {
            path: '/',
            component: products
        },
        {
            path: '/products/:id',
            component: product
        },
        {
            path: '/order',
            component: order,
        },
        {
            path: '/user',
            component: user,
        },
        {
            path: '/newpassword',
            component: new_password,
        },
        {
            path: '/admin',
            component: admin,
        },
        {
            path: '/admin/orders',
            component: adminOrders,
        },
        {
            path: '/admin/products',
            component: adminProducts,
        },
        {
            path: '/admin/products/:id',
            component: adminProduct,
        },
        {
            path: '/admin/params',
            component: adminParams,
        }
    ]
})

const vue = new Vue({
    data: function () {
        return {
            count: 0,
            products: [],
            user: undefined,
            maxPage: 1,
            currentPage: 1,
        }
    },
    created: function () {

        if (localStorage.user) {
            this.$http.post('/user', {id: localStorage.user}).then(
                res => this.user = JSON.parse(res.bodyText)
            )
        }

        if (document.cookie.length > 0)
            this.count = document.cookie.split('; ').length
    },
    methods: {
        bodyFunction: function (e) {

            if (e.target.classList.contains('backdrop'))
                closeWindows();

            if (!e.target.classList.contains('select-button')) {

                let selectButtons = document.querySelectorAll('.select-button');
                let selects = document.querySelectorAll('.select')

                for (let i = 0; i < selectButtons.length; i++) {

                    selectButtons[i].style.background = '#f7f7f7';
                    selectButtons[i].style.borderBottom = '1px solid #d3d3d3';
                }

                for (let i = 0; i < selects.length; i++) {

                    selects[i].classList.remove('x');
                }
            }
        },
        search: function (pageNum) {

            let path = this.$router.currentRoute.path;

            if (path === '/' || path === '/admin/products') {

                (typeof pageNum === "number") ?
                    this.currentPage = pageNum :
                    this.currentPage = 1;

                let category = document.querySelector('#category').value;
                let brand = document.querySelector('#brand').value;
                let model = document.querySelector('#model').value;
                let generation = document.querySelector('#generation').value;
                let pattern = document.querySelector('#pattern').value;
                let instock = document.querySelector('#in-stock').checked;
                let device;

                (window.innerWidth > 1260) ?
                    device = 'desktop' : device = 'mobile';

                if (category !== '')
                    category = '&category=' + category;

                if (brand !== '')
                    brand = '&brand=' + brand;

                if (model !== '')
                    model = '&model=' + model;

                if (generation !== '')
                    generation = '&generation=' + generation;

                if (pattern !== '')
                    pattern = '&pattern=' + pattern;

                if (instock)
                    instock = '&instock=instock'
                else
                    instock = ''

                this.$http.get('/products'
                    + '?device=' + device
                    + category
                    + brand
                    + model
                    + generation
                    + pattern
                    + instock).then(
                    res => {

                        let list = JSON.parse(res.bodyText);

                        let k;

                        (device === 'desktop') ? k = 9 : k = 3;

                        this.maxPage = Math.ceil(list.length / k);

                        let from = k * (this.currentPage - 1);
                        let to = from + k;

                        if (to > list.length)
                            to = list.length;

                        if (path === '/')
                            this.products = list.slice(from, to);
                        else
                            this.products = list;
                    }
                )
            }
        },
        addToBasket: function (product, prev, next) {

            if (next !== undefined) {

                if (Number(prev) === 0 && Number(next) === 1)
                    this.count++;

                if (Number(prev) === 1 && Number(next) === 0)
                    this.count--;

                this.$http.post(
                    '/basket',
                    {
                        id: product.id,
                        count: next,
                    },
                )
            }
        },
        login: function () {

            let email = document.querySelector('#log-email');
            let password = document.querySelector('#log-password');

            let user = {
                email: email.value,
                password: password.value,
            }

            this.$http.post('/login', user).then(
                res => {
                    if (res.bodyText === '-1') {

                        email.parentElement.classList.add('incorrect');
                        password.parentElement.classList.add('incorrect');

                    } else {

                        email.parentElement.classList.remove('incorrect');
                        password.parentElement.classList.remove('incorrect');

                        closeWindows();

                        this.$http.post('/user', {id: res.bodyText}).then(
                            result => {
                                this.user = JSON.parse(result.bodyText);
                                localStorage.user = this.user.id;
                            }
                        )
                    }
                });

            if (this.$router.currentRoute.path === '/')
                this.search();
        },
        logout: function () {

            delete localStorage.user;
            this.user = undefined;

            if (this.$router.currentRoute.path === '/')
                this.search();

            if(this.$router.currentRoute.path.startsWith('/admin') ||
               this.$router.currentRoute.path === '/user')
                this.$router.push('/');
        },
    },
    components: {
        'navbar': navbar,
        'footerr': footer,
        comments: comments,
    },
    router,
}).$mount('#app');