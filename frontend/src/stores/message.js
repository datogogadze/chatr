import { getAllMessagesForChatroom } from '@/api/api';
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
      console.log({ messages });
      this.messages = messages;
    },

    pushMessage(message) {
      this.messages.push(message);
    },
  },
});
