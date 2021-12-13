
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

        this.$http.get('/category/all').then(
            res => this.categories = JSON.parse(res.bodyText)
        );

        this.$http.get('/brand/all').then(
            res => this.brands = JSON.parse(res.bodyText)
        );

        this.$http.get('/stock/all').then(
            res => this.stocks = JSON.parse(res.bodyText)
        );

        this.$http.get('/country/all').then(
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
                this.$http.post('/' + param + '/' + id + '/save?name=' + name + '&parent=' + parent);
        },
        remove: function (param, id) {

            let res = confirm("Подтвердить изменения")

            if (res)
                this.$http.post('/' + param + '/' + id + '/delete');
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

export default adminParams

