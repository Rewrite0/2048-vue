import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Vue3TouchEvents from "vue3-touch-events"

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(Vue3TouchEvents);
app.mount('#app');