import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
});

export async function getAllChatrooms() {
  try {
    const response = await api.get('/chatroom');
    return response.data;
  } catch (error) {
    console.log({ error });
    return [];
  }
}

export async function getAllMessagesForChatroom(id) {
  try {
    const response = await api.get(`/message/chatroom/${id}`);
    return response.data;
  } catch (error) {
    console.log({ error });
    return [];
  }
}

export default api;
