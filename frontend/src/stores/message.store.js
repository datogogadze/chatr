import { getAllMessagesForChatroom, saveMessage } from '@/api/api';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => {
    return { messages: [] };
  },

  getters: {
    getMessages(state) {
      return state.messages;
    },
  },

  actions: {
    async fetchMessages(chatroomId) {
      const messages = await getAllMessagesForChatroom(chatroomId);
      this.messages = messages;
    },

    async pushMessage(message) {
      this.messages.push(message);
    },

    async saveMessage(message) {
      return await saveMessage(message);
    },

    clear() {
      this.messages = [];
    },
  },
});
