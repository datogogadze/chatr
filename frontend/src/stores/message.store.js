import { getAllMessagesForChatroom } from '@/api/api';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messages: {},
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

      if (messages && messages.length > 0) {
        this.oldest_message_timestamp = messages[0].created_at;
      }

      messages.forEach((message) => {
        let day = new Date(message.created_at).toDateString();
        if (!this.messages[day]) {
          this.messages[day] = [];
        }
        this.messages[day].push(message);
      });
      this.messages_loading = false;
    },

    async pushMessage(message) {
      let day = new Date(message.created_at).toDateString();
      if (!this.messages[day]) {
        this.messages[day] = [];
      }
      this.messages[day].push(message);
    },

    clear() {
      this.messages = {};
      this.oldest_message_timestamp = null;
      this.messages_loading = false;
    },
  },
});
