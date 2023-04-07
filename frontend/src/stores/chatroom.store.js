import { defineStore } from 'pinia';
import { createChatroom, deleteRoom } from '@/api/api';

export const useChatRoomStore = defineStore('chatroom', {
  state: () => {
    return { chatrooms: [], selectedRoom: null };
  },

  getters: {
    getChatrooms(state) {
      return state.chatrooms;
    },
    getSelectedRoomId(state) {
      return this.selectedRoom ? state.selectedRoom.id : null;
    },
  },

  actions: {
    addChatrooms(rooms) {
      this.chatrooms = rooms;
      this.selectedRoom = this.chatrooms.length > 0 ? this.chatrooms[0] : null;
    },

    pushChatroom(room) {
      this.chatrooms.push(room);
      this.selectedRoom = room;
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
        this.selectedRoom = this.chatrooms[this.chatrooms.length - 1];
      }
    },

    async deleteRoom(roomId) {
      const response = await deleteRoom(roomId);
      if (response) {
        this.chatrooms = this.chatrooms.filter((cr) => cr.id != roomId);
        this.chatrooms.length > 0
          ? (this.selectedRoom = this.chatrooms[0])
          : (this.selectedRoom = null);
      }
    },

    selectRoom(room) {
      this.selectedRoom = room;
    },

    clear() {
      this.chatrooms = [];
      this.selectedRoom = null;
    },
  },
});
