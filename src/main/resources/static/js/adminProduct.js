
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
            images : [null, null, null, null, null],
            imgBools: [false, false, false, false, false],
            imgFiles: [null, null, null, null, null],
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
                        this.$http.post('/product/save', product)
                }
            )
        },
        selectImg: function (id, e) {

            this.imgFiles[id] = e.target.files[0];

            let img = document.querySelector('#img' + id);
            img.src = URL.createObjectURL(this.imgFiles[id]);

            e.target.parentElement.classList.add('removable');
            e.target.parentElement.classList.remove('not-removable');
        },
        deleteImg: function (id, e) {

            this.images[id] = null;
            this.imgFiles[id] = null;

            let img = document.querySelector('#img' + id);
            img.src = '#';

            e.target.parentElement.classList.add('not-removable');
            e.target.parentElement.classList.remove('removable');
        },
        sendImgs: function () {

            let xhr = new XMLHttpRequest();
            let fd = new FormData();

            xhr.open('POST', '/product/' + this.product.id + '/img', true);

            for (let i = 1; i < this.imgFiles.length; i++)
                fd.append(i + '', this.imgFiles[i]);

            xhr.send(fd);
        },
    },
    created: function () {

        for (let i = 1; i < 5; i++) {

            let img = new Image();

            img.src = '/img/product-' + this.$route.params.id + '/' + i + '.jpg';

            img.onload = () => {

                this.imgBools[i] = true;
                this.images[i] = img;

                fetch(img.src)
                    .then(res => res.blob())
                    .then(blob => {
                        let image = new File([blob], img.src, blob);
                        this.imgFiles[i] = image;
                    })
            }
        }

        this.$http.get('/product/' + this.$route.params.id).then(
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

                this.$http.get('/generation/all').then(
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

        this.$http.get('/category/all').then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get('/stock/all').then(
            res => this.stocks = JSON.parse(res.bodyText)
        );
    },
    template: `
    <div class="container admin-product">
        <p class="h">Изображения</p>
        <div class="row imgs">
            <div v-for="i in 4" :class="imgBools[i] ? 'removable' : 'not-removable'" class="img">
                <input style="display: none"
                       type="file" 
                       @change="selectImg(i, $event)"
                       accept="image/*"
                       :ref="'imgInput' + i">
                <button class="img-button" 
                        @click="$refs[('imgInput' + i)][0].click()">+</button>
                <img :src="imgBools[i] ? images[i].src : '#'" 
                     :id="'img' + i"> 
                <div class="delete" @click="deleteImg(i, $event)">x</div>       
            </div>
            <button @click="sendImgs">Сохранить</button>
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

export default adminProduct
