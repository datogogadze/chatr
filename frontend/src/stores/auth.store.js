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
    return { me: null, access_token: null };
  },

  getters: {},

  actions: {
    async register(username, email, password) {
      const data = await registerUser(username, email, password);
      if (data);
      const me = await userMe();
      if (me) {
        this.me = me;
        this.access_token = data.access_token;
        return true;
      } else {
        return false;
      }
    },

    async login(email, password) {
      const data = await loginUser(email, password);
      if (data) {
        const me = await userMe();
        if (me) {
          this.me = me;
          this.access_token = data.access_token;
          return true;
        } else {
          return false;
        }
      }
    },

    async logout() {
      await logoutUser();
      this.me = null;
      this.access_token = null;
    },

    async refreshAccessToken() {
      const data = await refreshUserToken();
      if (data) {
        const me = await userMe();
        if (me) {
          this.me = me;
          this.access_token = data.access_token;
          return true;
        } else {
          return false;
        }
      }
    },
  },
});
