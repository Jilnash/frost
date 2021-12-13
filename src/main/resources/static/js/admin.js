
let admin = {
    template: `
    <div class="container col admin">
        <router-link :to="'/admin/params'">Параметры</router-link>
        <router-link :to="'/admin/products'">Товары</router-link>
        <router-link :to="'/admin/orders'">Заказы</router-link>
    </div>
    `
}

export default admin
