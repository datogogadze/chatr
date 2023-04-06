import { getAllMessagesForChatroom, sendMessage } from '@/api/api';
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
      const sent = await sendMessage(message);
      if (sent) {
        this.messages.push(message);
      }
    },
  },
});
