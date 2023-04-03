import { defineStore } from 'pinia';
import { getAllChatrooms, createChatroom, deleteRoom } from '@/api/api';

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

    async createChatroom(name) {
      const response = await createChatroom(name);
      if (response) {
        this.chatrooms.push({
          id: response.id,
          name: response.name,
          creator_id: response.creator_id,
          description: response.description,
          created_at: response.created_at,
        });
      }
    },

    async deleteRoom(roomId) {
      const response = await deleteRoom(roomId);
      if (response) {
        this.chatrooms = this.chatrooms.filter((cr) => cr.id != roomId);
      }
    },

    selectRoom(room) {
      this.selectedRoom = room;
    },
  },
});
