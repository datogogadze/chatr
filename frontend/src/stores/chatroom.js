import { defineStore } from 'pinia';
import { getAllChatrooms } from '@/api/api';

export const useChatRoomStore = defineStore('chatroom', {
  state: () => {
    return { chatrooms: [], selectedRoom: null };
  },

  getters: {
    getChatrooms(state) {
      return state.chatrooms;
    },
    getSelectedRoomId(state) {
      return state.selectedRoom.id;
    },
  },

  actions: {
    async fetchChatrooms() {
      const rooms = await getAllChatrooms();
      this.chatrooms = rooms;
      this.selectedRoom = rooms.length > 0 ? rooms[0] : null;
    },

    selectRoom(room) {
      this.selectedRoom = room;
    },
  },
});
