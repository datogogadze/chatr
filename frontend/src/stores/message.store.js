import { getAllMessagesForChatroom } from '@/api/api';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messages: new Map(),
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

      let newMessages = new Map();
      messages.forEach((message) => {
        let day = new Date(message.created_at).toDateString();
        if (!newMessages.get(day)) {
          newMessages.set(day, []);
        }
        newMessages.get(day).push(message);
      });

      this.messages.forEach((alreadyFetched, day) => {
        if (!newMessages.get(day)) {
          newMessages.set(day, []);
        }
        newMessages.get(day).push(...alreadyFetched);
      });

      this.messages = newMessages;

      this.messages_loading = false;
    },

    async pushMessage(message) {
      let day = new Date(message.created_at).toDateString();
      if (!this.messages.get(day)) {
        this.messages.set(day, []);
      }
      this.messages.get(day).push(message);
    },

    clear() {
      this.messages = new Map();
      this.oldest_message_timestamp = null;
      this.messages_loading = false;
    },
  },
});
