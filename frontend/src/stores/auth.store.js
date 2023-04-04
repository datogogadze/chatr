import { defineStore } from 'pinia';
import {
  loginUser,
  refreshUserToken,
  registerUser,
  userMe,
  logoutUser,
} from '@/api/api';

const LOGGED_IN = 'logged-in';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return { me: null };
  },

  getters: {},

  actions: {
    async register(username, email, password) {
      if (await registerUser(username, email, password));
      const me = await userMe();
      if (me) {
        this.me = me;
        localStorage.setItem(LOGGED_IN, 'true');
        return true;
      } else {
        localStorage.setItem(LOGGED_IN, 'false');
        return false;
      }
    },

    async login(email, password) {
      if (await loginUser(email, password)) {
        const me = await userMe();
        if (me) {
          this.me = me;
          localStorage.setItem(LOGGED_IN, 'true');
          return true;
        } else {
          localStorage.setItem(LOGGED_IN, 'false');
          return false;
        }
      }
    },

    async logout() {
      await logoutUser();
      this.me = null;
      localStorage.setItem(LOGGED_IN, 'false');
    },

    async refreshAccessToken() {
      if ((await refreshUserToken()) == true) {
        const me = await userMe();
        if (me) {
          this.me = me;
          localStorage.setItem(LOGGED_IN, 'true');
          return true;
        } else {
          localStorage.setItem(LOGGED_IN, 'false');
          return false;
        }
      }
    },
  },
});
