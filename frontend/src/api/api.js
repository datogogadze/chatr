import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

export async function registerUser(email, password) {
  try {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  } catch (error) {
    console.log({ error: error.response.data });
    return null;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await api.get('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.log({ error: error.response.data });
    return null;
  }
}

export async function getAllChatrooms() {
  try {
    const response = await api.get('/chatroom');
    return response.data;
  } catch (error) {
    console.log({ error: error.response.data });
    return [];
  }
}

export async function getAllMessagesForChatroom(id) {
  try {
    const response = await api.get(`/message/chatroom/${id}`);
    return response.data;
  } catch (error) {
    console.log({ error: error.response.data });
    return [];
  }
}

export default api;
