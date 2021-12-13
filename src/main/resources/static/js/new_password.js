
let new_password = {
    methods: {
        validatePassword: function () {

            let prev = document.querySelector('#prev');
            let next = document.querySelector('#next');
            let again = document.querySelector('#again');

            let password = {
                id: localStorage.user,
                prev: prev.value,
                next: next.value,
                again: again.value,
            }

            this.$http.post('/user/new-password', password).then(
                res => {

                    if (res.bodyText === 'empty prev') {

                        prev.parentElement.classList.add('incorrect');
                        prev.previousElementSibling.textContent = 'Задайте пароль';

                        return;
                    }

                    prev.parentElement.classList.remove('incorrect');

                    if (res.bodyText === 'prev') {

                        prev.parentElement.classList.add('incorrect');
                        prev.previousElementSibling.textContent = 'Неверный пароль';

                        return;
                    }

                    prev.parentElement.classList.remove('incorrect');

                    if (res.bodyText === 'empty next') {

                        next.parentElement.classList.add('incorrect');
                        again.parentElement.classList.add('incorrect');
                        next.previousElementSibling.textContent = 'Задайте новый пароль'

                        return;
                    }

                    next.parentElement.classList.remove('incorrect');
                    again.parentElement.classList.remove('incorrect');

                    if (res.bodyText === 'next') {

                        next.parentElement.classList.add('incorrect');
                        again.parentElement.classList.add('incorrect');
                        next.previousElementSibling.textContent = 'Пароли должны совпадать'

                        return;
                    }

                    next.parentElement.classList.remove('incorrect');
                    again.parentElement.classList.remove('incorrect');
                }
            )
        }
    },
    template: `
    <form class="new-password">
        <p class="h">Изменение пароля</p>
        <div>
            <p>Старый пароль</p>
            <p class="explanation"></p>
            <input class="grey-input" id="prev" type="password">
        </div>
        <div>    
            <p>Новый пароль</p>
            <p class="explanation"></p>
            <input class="grey-input" id="next" type="password">
        </div>
        <div>
            <p>Повторите пароль</p>
            <p class="explanation"></p>
            <input class="grey-input" id="again" type="password">
        </div>
        <input type="button" @click="validatePassword" class="button" value="Изменить">
    </form>
    `,
}

export default new_password
