import { defineStore } from 'pinia';
import {
  loginUser,
  refreshUserToken,
  registerUser,
  userMe,
  logoutUser,
} from '@/api/api';

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
        return true;
      } else {
        return false;
      }
    },

    async login(email, password) {
      if (await loginUser(email, password)) {
        const me = await userMe();
        if (me) {
          this.me = me;
          return true;
        } else {
          return false;
        }
      }
    },

    async logout() {
      await logoutUser();
      this.me = null;
    },

    async refreshAccessToken() {
      if ((await refreshUserToken()) == true) {
        const me = await userMe();
        if (me) {
          this.me = me;
          return true;
        } else {
          return false;
        }
      }
    },
  },
});
