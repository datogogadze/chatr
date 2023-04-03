import router from '@/router';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

api.defaults.withCredentials = true;

const LOGGED_IN = 'logged-in';

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401) {
      try {
        if (error.config.url !== '/auth/refresh') {
          const response = await api.post('/auth/refresh');
          if (response.status === 200) {
            return api(error.config);
          }
        } else {
          await api.post('/auth/clear-cookies');
          if (
            router.currentRoute.value.name !== 'Registration' &&
            router.currentRoute.value.name !== 'Login'
          ) {
            localStorage.setItem(LOGGED_IN, 'false');
            router.push('/login');
          }
        }
      } catch (err) {
        localStorage.setItem(LOGGED_IN, 'false');
        router.push('/login');
        return Promise.reject(err);
      }
    }
    localStorage.setItem(LOGGED_IN, 'false');
    router.push('/login');
    return Promise.reject(error);
  }
);

export async function registerUser(username, email, password) {
  try {
    await api.post('/auth/register', { username, email, password });
    return true;
  } catch (error) {
    console.log('Error in registerUser', { error: error.response.data });
    return false;
  }
}

export async function userMe() {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.log('Error in userMe', { error: error.response.data });
    return null;
  }
}

export async function loginUser(email, password) {
  try {
    await api.post('/auth/login', { email, password });
    return true;
  } catch (error) {
    console.log('Error in loginUser', { error: error.response.data });
    return false;
  }
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (error) {
    console.log('Error in logoutUser', { error: error.response.data });
    return false;
  }
}

export async function refreshUserToken() {
  try {
    const response = await api.post('/auth/refresh');
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error in refreshUserToken', { error: error.response.data });
    return false;
  }
}

export async function getAllChatrooms() {
  try {
    const response = await api.get('/chatroom');
    return response.data;
  } catch (error) {
    console.log('Error in getAllChatrooms', { error: error.response.data });
    return [];
  }
}

export async function getAllMessagesForChatroom(id) {
  try {
    const response = await api.get(`/message/chatroom/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error in getAllMessagesForChatroom', {
      error: error.response.data,
    });
    return [];
  }
}

export default api;
