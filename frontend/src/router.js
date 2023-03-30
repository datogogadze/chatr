import Login from './components/Login.vue';
import Registration from './components/Registration.vue';
import MainPage from './components/MainPage.vue';
import * as VueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
  {
    path: '/home',
    name: 'Home',
    component: MainPage,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

const checkIfUserIsLoggedIn = () => true;

router.beforeEach((to, from, next) => {
  const isLoggedIn = checkIfUserIsLoggedIn();
  if (to.name !== 'login' && to.name !== 'register' && !isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
