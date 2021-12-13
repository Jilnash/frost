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

export {displayWindow, closeWindows, displayDropdown, changeOption};

import navbar from './navbar.js'
import products from './products.js'
import footer from './footer.js'
import product from './product.js'
import comments from './comments.js'
import order from './order.js'
import user from './user.js'
import admin from './admin.js'
import adminParams from './adminParams.js'
import adminOrders from './adminOrders.js'
import adminProducts from './adminProducts.js'
import adminProduct from './adminProduct.js'
import new_password from './new_password.js'

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

new Vue({
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
            this.$http.post('/user/' + localStorage.user).then(
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

                this.$http.get('/product/all'
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

            this.$http.post('/user/login', user).then(
                res => {
                    if (res.bodyText === '-1') {

                        email.parentElement.classList.add('incorrect');
                        password.parentElement.classList.add('incorrect');

                    } else {

                        email.parentElement.classList.remove('incorrect');
                        password.parentElement.classList.remove('incorrect');

                        closeWindows();

                        this.$http.post('/user/' + res.bodyText).then(
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

            if (this.$router.currentRoute.path.startsWith('/admin') ||
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