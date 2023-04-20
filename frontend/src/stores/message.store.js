import { getAllMessagesForChatroom } from '@/api/api';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messages: [],
      oldest_message_timestamp: null,
      messages_loading: false,
    };
  },

  getters: {
    getMessages(state) {
      return state.messages;
    },
  },

  actions: {
    async fetchMessages(chatroomId) {
      this.messages_loading = true;
      const messages = await getAllMessagesForChatroom(
        chatroomId,
        this.oldest_message_timestamp
      );

      if (!messages || messages.length === 0) {
        this.messages_loading = false;
        return;
      }

      this.oldest_message_timestamp = messages[0].created_at;

      this.messages = [...messages, ...this.messages];

      this.messages_loading = false;
    },

    async pushMessage(message) {
      this.messages.push(message);
    },

    clear() {
      this.messages = [];
      this.oldest_message_timestamp = null;
      this.messages_loading = false;
    },
  },
});
