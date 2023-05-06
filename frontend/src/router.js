import LoginForm from './components/LoginForm.vue';
import RegistrationForm from './components/RegistrationForm.vue';
import MainPage from './components/MainPage.vue';
import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationForm,
  },
  {
    path: '/home',
    name: 'MainPage',
    component: MainPage,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;
