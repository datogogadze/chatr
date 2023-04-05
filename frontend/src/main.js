import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'jquery/dist/jquery.slim';
import 'popper.js/dist/umd/popper.min';
import { createPinia } from 'pinia';
import router from './router';

createApp(App).use(router).use(createPinia()).mount('#app');
