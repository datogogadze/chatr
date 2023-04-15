import router from '@/router';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

api.defaults.withCredentials = true;

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401) {
      try {
        if (error.config.url !== '/api/auth/refresh') {
          const response = await api.post('/api/auth/refresh');
          if (response.status === 200) {
            return api(error.config);
          }
        } else {
          await api.post('/api/auth/clear-cookies');
          if (
            router.currentRoute.value.name !== 'Registration' &&
            router.currentRoute.value.name !== 'Login'
          ) {
            router.push('/login');
          }
        }
      } catch (err) {
        if (
          router.currentRoute.value.name !== 'Registration' &&
          router.currentRoute.value.name !== 'Login'
        ) {
          router.push('/login');
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export async function registerUser(username, email, password) {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log('Error in registerUser', { error: error.response.data });
    return null;
  }
}

export async function userMe() {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.log('Error in userMe', { error: error.response.data });
    return null;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.log('Error in loginUser', { error: error.response.data });
    return null;
  }
}

export async function logoutUser() {
  try {
    await api.post('/api/auth/logout');
    return true;
  } catch (error) {
    console.log('Error in logoutUser', { error: error.response.data });
    return false;
  }
}

export async function refreshUserToken() {
  try {
    const response = await api.post('/api/auth/refresh');
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.log('refresh token failed', error?.response.status);
    return null;
  }
}

export async function getAllChatrooms() {
  try {
    const response = await api.get('/api/chatroom');
    return response.data;
  } catch (error) {
    console.log('Error in getAllChatrooms', { error: error.response.data });
    return [];
  }
}

export async function findChatrooms(term) {
  try {
    const response = await api.post('/api/chatroom/search', { term });
    return response.data;
  } catch (error) {
    console.log('Error in findChatrooms', { error: error.response.data });
    return [];
  }
}

export async function addUserToRoom(chatroomId) {
  try {
    const response = await api.post('/api/chatroom/add-user', { chatroomId });
    return response.data;
  } catch (error) {
    console.log('Error in findChatrooms', { error: error.response.data });
    return undefined;
  }
}

export async function getAllMessagesForChatroom(id) {
  try {
    const response = await api.get(`/api/message/chatroom/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error in getAllMessagesForChatroom', {
      error: error.response.data,
    });
    return [];
  }
}

export async function createChatroom(name) {
  try {
    const response = await api.post(`/api/chatroom`, { name });
    return response.data;
  } catch (error) {
    if (error.response.data.statusCode === 400) {
      alert(error.response.data.message);
    }
    console.log('Error in createChatroom', {
      error: error?.response?.data,
    });
    return null;
  }
}

export async function removeUserFromChatroom(id) {
  try {
    const response = await api.delete(`/api/chatroom/${id}/user`);
    return response.data;
  } catch (error) {
    console.log('Error in removeUserFromChatroom', {
      error: error.response.data,
    });
    return null;
  }
}

export default api;
