
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

        this.$http.get("/category/all").then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get("/brand/all").then(
            res => this.brands = JSON.parse(res.bodyText)
        );

        this.$http.get("/product/all").then(
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
                this.$http.get('/model/all?brand=' + name).then(
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
                this.$http.get('/generation/all?model=' + name).then(
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

export default adminProducts
