
let adminOrders = {
    data: function () {
        return {
            orders: [],
            statuses: [],
        }
    },
    created: function () {

        this.$http.get("/order/all").then(
            res => this.orders = JSON.parse(res.bodyText)
        );

        this.$http.get("/status/all").then(
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

            this.$http.get('/order/all?p=p' + id + after + before + status + phone).then(
                res => this.orders = JSON.parse(res.bodyText)
            )
        },
        save: function (order) {

            let status = document.querySelector('#o' + order).value;

            this.$http.post('/order/ ' + order + '/status/' + status);
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

export default adminOrders
