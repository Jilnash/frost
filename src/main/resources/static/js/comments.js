import {displayWindow} from "./js.js";

let comments = Vue.component('comments', {
    props: ['comments', 'user', 'product'],
    methods: {
        displayWindow: function (windowClass) {

            displayWindow(windowClass)
        },
        comment: function (e) {

            let text = e.target.previousElementSibling;

            if (text.value.length > 0) {

                this.$http.post('/product/' + this.product.id + '/comment', {
                    user: this.user.id,
                    text: text.value,
                })

                this.comments.unshift({
                    name: this.user.name + ' ' + this.user.surname,
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
                            {{ comment.name }}
                        </b>
                    </p>
                    <p>{{ comment.text }}</p>
                </div>
            </div>
    </div>
    `
});

export default comments
