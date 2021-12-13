import {closeWindows, displayWindow} from "./js.js";

let product = {
    data: function () {
        return {
            product: {},
            c: 0,
            maxCount: 0,
            brands: [],
            comments: [],
            images: [null, null, null, null]
        }
    },
    props: ['user', 'count', 'addToBasket'],
    created: function () {

        this.$http.get('/product/' + this.$route.params.id).then(
            res => {
                this.product = JSON.parse(res.bodyText);

                this.comments = this.product.comments.reverse()

                this.$http.get('/product/' + this.product.id + '/count').then(
                    result => this.maxCount = JSON.parse(result.bodyText)
                );
            }
        );

        this.$http.get('/product/' + this.$route.params.id + '/brands').then(
            res => this.brands = JSON.parse(res.bodyText)
        )

        if (localStorage.user) {

            this.$http.post('/user/' + localStorage.user).then(
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
        closeWindows: function () {
            closeWindows()
        },
        displayChild: function (e) {

            let parent = e.target.parentElement;

            if (parent.classList.contains('x'))
                parent.classList.remove('x')
            else
                parent.classList.add('x')
        },
        setDefImg: function (e) {
            e.target.src = 'img/Заглушка.svg'
        },
    },
    template: `
    <div>
        <div class="container product">
            <div class="row desktop">
                <div class="left">
                    <div class="product-imgs">
                        <img class="frame main-img" :src="'img/product-' + product.id + '/1.jpg'"  @error="setDefImg($event)">
                        <div class="row all-imgs">
                            <div v-for="n in 4" class="frame">
                                <img :src="'img/product-' + product.id + '/' + n + '.jpg'" @error="setDefImg($event)">
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
                    <img class="frame main-img" :src="'img/product-' + product.id + '/1.jpg'"  @error="setDefImg($event)">
                    <div class="row all-imgs">
                        <div v-for="n in 4" class="frame">
                            <img :src="'img/product-' + product.id + '/' + n + '.jpg'" @error="setDefImg($event)">
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

export default product
