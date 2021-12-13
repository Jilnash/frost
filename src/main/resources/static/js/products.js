import {changeOption, displayDropdown} from "./js.js";

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

        this.$http.get("/category/all").then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get("/brand/all").then(
            res => this.brands = JSON.parse(res.bodyText)
        );

        let k;

        (window.innerWidth > 1260) ? k = 9 : k = 3;

        this.$http.get("/product/all").then(
            res => {
                let list = JSON.parse(res.bodyText);
                this.products = list.slice(0, k);
                this.maxPage = Math.ceil(list.length / k);
            }
        );

        this.currentPage = 1;
    },
    methods: {
        displayDropdown: function (e) {
            displayDropdown(e)
        },
        changeOption: function (e) {
            changeOption(e)
        },
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

            this.$http.get('/model/all?brand=' + brandName).then(
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

            this.$http.get('/generation/all?model=' + modelName).then(
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
        setDefImg: function (e) {
            e.target.src = 'img/Заглушка.svg'
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
                        <img :src="'img/product-' + product.id + '/1.jpg'" @error="setDefImg($event)">
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

export default products
