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

    let option = e.currentTarget.textContent.replaceAll("\\s+$", ""); // option text
    let a = e.target.parentElement.previousElementSibling; // <a> select element
    let input = a.previousElementSibling; // input

    input.value = option;

    a.classList.remove('x')

    a.textContent = option;
    a.style.backgroundColor = '#f7f7f7';
    a.style.borderBottom = '1px solid #d3d3d3';
}

let navbar = {
    data: function () {
        return {}
    },
    props: ['products', 'search', 'user'],
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
        login: function (e) {

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
                                localStorage.user = JSON.parse(result.bodyText).id
                                this.user = JSON.parse(result.bodyText)
                            }
                        )
                    }
                });
        },
        logout: function () {
            delete localStorage.user
            this.user = localStorage.user
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

            this.$http.post('/validate-user', user).then(
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
                        <router-link :to="'/user'">Личный кабинет</router-link>
                        <a href="#" @click="logout" style="margin-top: 6px">Выйти</a>
                    </div>
                    <router-link :to="'/order'" class="basket">
                        <img src="/img/Group%202.svg">
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
                                <router-link :to="'/user'">Личный кабинет</router-link>
                                <div></div>
                                <router-link :to="'/products'" @click="logout">Выйти</router-link>
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
            currentPage: 3,
        };
    },
    props: ['products', 'search'],
    created: function () {
        this.$http.get("/categories").then(
            res => this.categories = JSON.parse(res.bodyText)
        );
        this.$http.get("/brands").then(
            res => this.brands = JSON.parse(res.bodyText)
        );
        this.$http.get("/products?page=1").then(
            res => this.products = JSON.parse(res.bodyText)
        )
    },
    methods: {
        displayDropdown: displayDropdown,
        changeOption: changeOption,
        changePage: function (direction) {

            let backward = document.querySelector('.backward');
            let forward = document.querySelector('.forward');
            let ellipsis = document.querySelectorAll('.ellipsis');

            if (direction === 'next')
                this.currentPage++;

            if (direction === 'prev')
                this.currentPage--;


            if (this.currentPage < 2)
                backward.style.display = 'none';
            else
                backward.style.display = 'flex';

            if (this.currentPage > 6)
                forward.style.display = 'none';
            else
                forward.style.display = 'flex';


            if (this.currentPage < 3)
                ellipsis[0].style.display = 'none';

            if (this.currentPage > 4)
                ellipsis[1].style.display = 'none';

            if (this.currentPage > 3 &&
                this.currentPage < 5) {

                ellipsis[0].style.display = 'block';
                ellipsis[1].style.display = 'block';
            }
        },
        changeBrand: function (e) {

            let brandName = e.currentTarget.textContent;

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
        },
        changeModel: function (e) {

            let modelName = e.currentTarget.textContent;

            this.$http.get('/generations?model=' + modelName).then(
                res => this.generations = JSON.parse(res.bodyText)
            )

            this.changeOption(e);

            let generation = document.querySelector('#generation')

            generation.value = '';
            generation.nextElementSibling.textContent = 'Все поколения';

            this.generations = [];
        }
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
                        <input @change="search" id="category" type="hidden" name="category" value="">
                        <a @click="displayDropdown" class="select-button">Все категории</a>
                        <div class="dropdown">
                            <a v-for="category in categories" 
                               :key="category.id" 
                               @click="changeOption">{{ category.name }}</a>
                        </div>
                    </div>
                    <div class="select">
                        <p>Марка</p>
                        <input @change="search" id="brand" type="hidden" name="brand" value="">
                        <a @click="displayDropdown" class="select-button">Все марки</a>
                        <div class="dropdown">
                            <a v-for="brand in brands" 
                               :key="brand.id"
                               @click="changeBrand">{{ brand.name }}</a>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="select" style="margin-bottom: 25px">
                        <p>Модель</p>
                        <input @change="search" id="model" type="hidden" name="model" value="">
                        <a @click="displayDropdown" class="select-button">Все модели</a>
                        <div class="dropdown">
                            <a v-if="models.length === 0">Выберите марку</a>
                            <a v-else
                               v-for="model in models"
                               :key="model.id"
                               @click="changeModel">{{ model.name }}</a>
                        </div>
                    </div>
                    <div class="select">
                        <p>Поколение</p>
                        <input @change="search" id="generation" type="hidden" value="">
                        <a @click="displayDropdown" class="select-button">Все поколения</a>
                        <div class="dropdown">
                            <a v-if="generations.length === 0">Выберите модель</a>
                            <a v-else
                               v-for="generation in generations"
                               :key="generation.id"
                               @click="changeOption">{{ generation.name }}</a>
                        </div>
                    </div>
                </div>
                <label for="in-stock" class="row">
                    <input type="checkbox" id="in-stock" name="instock">
                    <p>в наличии</p>
                </label>
            </div>
            <div class="container row product-list">
                    <div class="col frame product-item"
                         v-for="product in products"
                         :key="product.id">
                        <img src="img/Заглушка.svg">
                        <p>{{ product.name }}</p>
                        <div>
                            <p>{{ product.price }} тг</p>
                            <router-link :to="'/products/' + product.id" class="button">Купить</router-link>
                        </div>
                    </div>
            </div>
            <div class="container row page-number">
                <div class="frame backward"
                     @click="changePage('prev', $event)">
                    <img src="/img/Rectangle%202.2.svg">
                </div>
                
                <div class="frame number">1</div>
                <div class="ellipsis" style="display: none">...</div>
                <div class="frame number choosen">2</div>
                <div class="frame number">3</div>
                <div class="ellipsis">...</div>
                <div class="frame number">7</div>
                
                <div class="frame forward"
                     @click="changePage('next', $event)">
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

let product = {
    data: function () {
        return {
            product: {},
            c: 0,
            productBrands: [],
            comments: [],
        }
    },
    props: ['user'],
    created: function () {

        this.$http.get('/products/' + this.$route.params.id).then(
            res => {
                this.product = JSON.parse(res.bodyText);
                this.productBrands = this.product.productBrands;
            }
        );

        if (localStorage.user) {

            this.$http.post('/user', {id: localStorage.user}).then(
                res => this.user = JSON.parse(res.bodyText)
            )
        }
    },
    methods: {
        addToBasket: function (x) {

            if (x === '-' && this.c > 0) {
                this.c--;
            }

            if (x === '+') {
                this.c++;
            }

            this.$http.post(
                '/basket',
                {
                    id: this.product.id.toString(),
                    count: this.c.toString(),
                },
            )
        },
        displayWindow: function (windowClass) {

            displayWindow(windowClass)
        },
        displayWindowAndAddToBasket: function (windowClass) {

            displayWindow(windowClass);

            let cookies = document.cookie.split('; ');

            for (let i = 0; i < cookies.length; i++) {

                if (cookies[i].startsWith('product' + this.product.id)) {

                    let records = cookies[i].split('product')[1];

                    let count = records.split('=')[1];
                    this.c = count;

                    return;
                }
            }

            this.c = 1;

            this.addToBasket(this.c);
        },
        closeWindows: closeWindows,
        displayChild: function (e) {

            let child = e.target.nextElementSibling;

            if (child !== null &&
                child.classList.contains('model') ||
                child.classList.contains('type')) {

                if (!e.target.classList.contains('x')) {
                    e.target.classList.add('x');
                } else {
                    e.target.classList.remove('x');
                }

                if (child.style.display === 'block') {
                    child.style.display = 'none';
                } else {
                    child.style.display = 'block';
                }
            }
        }
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
                        
                            <div class="brand"
                                 v-for="pb in product.productBrands"
                                 :key="pb.id">
                                 
                                 <p class="parent" 
                                    @click="displayChild">
                                    {{ pb.brand.name }}
                                 </p>
                                 
                                 <div class="model"
                                      v-for="model in pb.brand.models"
                                      :key="model.id">
                                      
                                      <p class="parent"
                                         v-for="generation in model.generations"
                                         @click="displayChild">
                                         {{ model.name }} {{ generation.name }}
                                      </p>
                                      
                                      <div class="type">
                                        <p>2 CRDi</p>
                                        <p>2 CRDi Привод на все колеса</p>
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
                            <div class="in-stock">
                                <p class="text"><b>в наличии</b></p>
                                <p v-for="instock in product.instocks"
                                   :key="instock.id">
                                   
                                   г. {{ instock.city }}
                                </p>
                            </div>
                            <a href="#" class="button" @click="displayWindowAndAddToBasket('basket-icon')">Купить</a>
                        </div>
                    </div>
                    <div class="product-comments">
                        <p class="h3">Отзывы</p>
                        <p v-if="user === undefined">
                            Чтобы оставить отзыв <a href="#" @click="displayWindow('login')">войдите на сайт</a>
                        </p>
                        <input v-else class="grey-input" type="text">
                        <div class="comment">
                            <p class="name"><b>Константин Константинов Констанинович</b></p>
                            <p>Несколько лет подбираю в этом магазине, ребята очень быстро подбирают, что нужно и по
                                адекватным ценам. Спасибо, что вырусаете</p>
                        </div>
                        <div class="comment"
                             v-for="comment in product.comments"
                             :key="comment.id">
                             
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
                    <div class="in-stock">
                        <p class="text"><b>в наличии</b></p>
                        <p v-for="instock in product.instocks"
                           :key="instock.id">
                           г. {{ instock.city }}
                        </p>
                    </div>
                    <a href="#" class="button" @click="displayWindow('basket-icon')">Купить</a>
                </div>
                <div class="product-text">
                    <p><b>Артикул: </b>{{ product.article }}</p>
                    <p><b>Производитель: </b>{{ product.manufacturer }}</p>
                    <p class="descr"><b>Описание: </b>{{ product.description }}</p>
                </div>
                <div class="compatable">
                    <p>Применим к автомобилям:</p>
                    <div class="grey-frame">
                        <div class="brand"
                             v-for="pb in product.productBrands"
                             :key="pb.id">
                             
                             <p class="parent" 
                                @click="displayChild">
                                {{ pb.brand.name }}
                             </p>
                             
                             <div class="model"
                                  v-for="model in pb.brand.models"
                                  :key="model.id">
                                  
                                  <p class="parent"
                                     v-for="generation in model.generations"
                                     @click="displayChild">
                                     {{ model.name }} {{ generation.name }}
                                  </p>
                                  
                                  <div class="type">
                                      <p>2 CRDi</p>
                                      <p>2 CRDi Привод на все колеса</p>
                                  </div>
                             </div>
                        </div>
                    </div>
                </div>
                <div class="product-comments">
                    <p class="h3">Отзывы</p>
                    <p>Чтобы оставить отзыв <a href="#" @click="displayWindow('login')">войдите на сайт</a></p>
                    <div class="comment"
                         v-for="comment in product.comments"
                         :key="comment.id">
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
                            <button @click.prevent="addToBasket('-')">-</button>
                            <div>{{ c }}</div>
                            <button @click.prevent="addToBasket('+')">+</button>
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
            price: null,
        };
    },
    props: ['user'],
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
        displayDropdown: displayDropdown,
        changeOption: changeOption,
        setProductPrice: function (id) {

            this.$http.get('/products/' + id).then(
                res => this.price = JSON.parse(res.bodyText).price
            );
        },
        addToBasket: function (id, count, x) {

            console.log(count)

            this.setProductPrice(id);

            this.$http.post(
                '/basket',
                {
                    id: id,
                    count: count,
                },
            );

            if (x === '-'
                && this.total - this.price >= 0
                && count > 0)

                this.total -= this.price;

            if (x === '+'
                && count > 0)

                this.total += this.price;
        },
        deleteItem: function (id, price, count, e) {

            this.addToBasket(id, 0);

            this.total -= count * price;

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

            this.$http.post('/validate-order-contacts', order).then(
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

                    if (validationMap.password !== undefined) {

                        ok = false;
                        password.parentElement.classList.add('incorrect');
                        password1.parentElement.classList.add('incorrect');

                        password.previousElementSibling.textContent = validationMap.password;

                    } else {

                        password.parentElement.classList.remove('incorrect');
                        password1.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.user !== undefined) {

                        ok = false;
                        email.parentElement.classList.add('incorrect');
                        password.parentElement.classList.add('incorrect');
                        password1.parentElement.classList.add('incorrect');
                        email.previousElementSibling.textContent = validationMap.user;

                    } else {

                        email.parentElement.classList.remove('incorrect');
                        password.parentElement.classList.remove('incorrect');
                        password1.parentElement.classList.remove('incorrect');
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

            this.$http.post('/validate-order-shipping', order).then(
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

                            if(a.name.startsWith('product'))

                                order[a.name] = a.value;

                        this.$http.post('/order', order);
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
                                <button @click.prevent="addToBasket(item.product.id, --item.count, '-')">-</button>
                                <div v-if="item.count >= 0">{{ item.count }}</div>
                                <div v-else="item.count = 0">0</div>
                                <button @click.prevent="addToBasket(item.product.id, ++item.count, '+')">+</button>
                            </div>
                            <p class="price">{{ item.product.price }} тг</p>
                        </div>
                    </div>
                    <p>Артикул: {{ item.product.article }}</p>
                    <a href="#" @click="deleteItem(item.product.id, item.product.price, item.count, $event)">Удалить из корзины</a>
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
                <input type="button" class="button" value="Оформить заказ" @click="displayContacts">
            </form>
            <form class="row content-contacts">
                <div>
                    <div>
                        <p>Фамилия</p>
                        <p class="explanation"></p>
                        <input id="order-surname" class="grey-input" type="text" :value="user.surname">
                    </div>
                    <div>
                        <p>Имя</p>
                        <p class="explanation"></p>
                        <input id="order-name" class="grey-input" type="text" :value="user.name">
                    </div>
                    <div>
                        <p>Отчество</p>
                        <p class="explanation"></p>
                        <input id="order-patronymic" class="grey-input" type="text" :value="user.patronymic">
                    </div>
                    <div>
                        <p>Телефон</p>
                        <p class="explanation"></p>
                        <input id="order-phone" class="grey-input" type="text" :value="user.phone">
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
                            <a v-for="region in regions" 
                               :key="region.id"
                               @click="changeOption">{{ region.name }}</a>
                        </div>
                    </div>
                    <div>
                        <p>Город и поселок</p>
                        <p class="explanation"></p>
                        <input id="order-city" class="grey-input" type="text" :value="user.city">
                    </div>
                </div>
                <div class="vertical-line"></div>
                <div>
                    <div>
                        <p>Улица</p>
                        <p class="explanation"></p>
                        <input id="order-street" class="grey-input" type="text" :value="user.street">
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>Дом</p>
                            <p class="explanation"></p>
                            <input id="order-house" class="grey-input" type="text" :value="user.house">
                        </div>
                        <div class="col">
                            <p>Квартира</p>
                            <p class="explanation"></p>
                            <input id="order-flat" class="grey-input" type="text" :value="user.flat">
                        </div>
                    </div>
                </div>
                <input type="button" class="button" @click="validateOrderShipping" value="Оформить заказ">
            </form>
            <div class="row content-order">
                <div class="row">
                    <img src="/img/Group%208.svg">
                    <p>Заказ №1000001 был создан. Вы можете просмотреть список всех ваших заказов в личном кабинете.</p>
                </div>
                <router-link :to="'/user'">Перейти в личный кабинет</router-link>
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
        };
    },
    props: ['user'],
    created: function () {

        this.$http.get("/countries").then(
            res => this.countries = JSON.parse(res.bodyText)
        )

        this.$http.get("/regions").then(
            res => this.regions = JSON.parse(res.bodyText)
        )

        if (localStorage.user) {

            this.$http.post('/user', {id: localStorage.user}).then(
                res => {
                    this.user = JSON.parse(res.bodyText)
                }
            )
        }
    },
    methods: {
        displayMyOrders: function (e) {
            document.querySelector('.my-orders').classList.add('choosen');
            document.querySelector('.my-contacts').classList.remove('choosen');
            document.querySelector('.my-shippings').classList.remove('choosen');
            document.querySelector('.content').style.marginBottom = '303px';
            document.querySelector('.my-order').style.display = 'block';
            document.querySelector('.my-contact').style.display = 'none';
            document.querySelector('.my-shipping').style.display = 'none';
        },
        displayMyContacts: function (e) {
            document.querySelector('.my-orders').classList.remove('choosen');
            document.querySelector('.my-contacts').classList.add('choosen');
            document.querySelector('.my-shippings').classList.remove('choosen');
            document.querySelector('.content').style.marginBottom = '518px';
            document.querySelector('.my-order').style.display = 'none';
            document.querySelector('.my-contact').style.display = 'flex';
            document.querySelector('.my-shipping').style.display = 'none';
        },
        displayMyShippings: function (e) {
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

            this.$http.post('/validate-user-contacts', user).then(
                res => {

                    let validationMap = JSON.parse(res.bodyText);

                    if (validationMap.name !== undefined) {

                        console.log(validationMap.name)

                        ok = false;
                        name.parentElement.classList.add('incorrect');
                        name.previousElementSibling.textContent = validationMap.name;

                    } else {

                        name.parentElement.classList.remove('incorrect');
                    }

                    if (validationMap.surname !== undefined) {

                        console.log(validationMap.surname)

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

                    console.log("contacts");
                    console.log(user)
                    console.log(validationMap);

                    if (ok)
                        this.$http.post('/user-contacts', user);
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

            this.$http.post('/validate-user-shipping', user).then(
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

                    console.log("shipping")
                    console.log(user)
                    console.log(validationMap)

                    if (ok)
                        this.$http.post('/user-shipping', user);
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
                            <div class="horizontal-line"></div>
                            <div class="row">
                                <div class="row">
                                    <p class="mobile-id">Номер заказа</p>
                                    <p class="id">№100001</p>
                                </div>
                                <div class="order-details">
                                    <p class="mobile-name">Наименования товара</p>
                                    <p class="name">Копрессор кондиционера Hyndai Tuscon, Kia Sportage 97701-2E300FD;
                                        035-03se; Kia
                                        Sportage 97701-2E300FD; 0935-02</p>
                                    <p class="count">1 X 110 999 тг</p>
                                    <p class="name">Копрессор кондиционера Hyndai Tuscon, Kia Sportage 97701-2E300FD;
                                        035-03se;</p>
                                    <p class="count">1 X 95 999 тг</p>
                                </div>
                                <div class="row">
                                    <p class="mobile-date">Дата заказов</p>
                                    <p class="date">06.07.2019</p>
                                </div>
                                <div class="row">
                                    <p class="mobile-price">Стоимость</p>
                                    <p class="price">206 998 тг</p>
                                </div>
                            </div>
                            <div class="horizontal-line"></div>
                            <div class="row">
                                <div class="row">
                                    <p class="mobile-id">Номер заказа</p>
                                    <p class="id">№100002</p>
                                </div>    
                                <div class="order-details">
                                    <p class="mobile-name">Наименования товара</p>
                                    <p class="name">Копрессор кондиционера Hyndai Tuscon, Kia Sportage 97701-2E300FD;
                                        035-03se; Kia
                                        Sportage 97701-2E300FD; 0935-02</p>
                                    <p class="count">1 X 110 999 тг</p>
                                </div>
                                <div class="row">
                                    <p class="mobile-date">Дата заказов</p>
                                    <p class="date">04.07.2019</p>
                                </div>
                                <div class="row">
                                    <p class="mobile-price">Стоимость</p>    
                                    <p class="price">110 999 тг</p>
                                </div>    
                            </div>
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
                                <input id="user-country" type="hidden">
                                <a @click="displayDropdown" class="select-button">Республика Казахстан</a>
                                <div class="dropdown">
                                    <a v-for="country in countries" 
                                       :key="country.id"
                                       @click="changeOption">{{ country.name }}</a>
                                </div>
                            </div>
                            <div class="select">
                                <p>Регион / Область</p>
                                <p class="explanation"></p>
                                <input id="user-region" type="hidden">
                                <a @click="displayDropdown" class="select-button">Акмолинская область</a>
                                <div class="dropdown">
                                    <a v-for="region in regions" 
                                       :key="region.id"
                                       @click="changeOption">{{ region.name }}</a>
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
    template: `
    <form class="new-password">
        <p class="h">Изменение пароля</p>
        <p>Старый пароль</p>
        <input class="grey-input" type="password">
        <p>Новый пароль</p>
        <input class="grey-input" type="password">
        <p>Повторите пароль</p>
        <input class="grey-input" type="password">
        <input type="submit" class="button" value="Изменить">
    </form>
    `,
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
    ]
})

const vue = new Vue({
    data: function () {
        return {
            products: [],
            user: localStorage.user,
        }
    },
    created: function () {
        this.$http.get("/products?page=1").then(
            res => this.products = JSON.parse(res.bodyText)
        )
    },
    methods: {
        bodyFunction: function (e) {

            if (e.target.classList.contains('backdrop')) {

                closeWindows();
            }

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
        search: function () {

            let category = document.querySelector('#category').value;
            let brand = document.querySelector('#brand').value;
            let model = document.querySelector('#model').value;
            let generation = document.querySelector('#generation').value;
            let pattern = document.querySelector('#pattern').value;

            let page = '?page=1'

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

            this.$http.get('/products'
                + page
                + category
                + brand
                + model
                + generation
                + pattern).then(
                res => this.products = JSON.parse(res.bodyText)
            )
        }
    },
    components: {
        'navbar': navbar,
        'footerr': footer,
        'products': products,
        'product': product,
        'order': order,
        'user': user,
        'new-password': new_password,
    },
    router,
}).$mount('#app');