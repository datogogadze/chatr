import { defineStore } from 'pinia';
import { createChatroom, removeUserFromChatroom } from '@/api/api';

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
      if (rooms) {
        this.chatrooms = rooms;
        const roomId = localStorage.getItem('selectedRoomId');
        let room = false;
        if (roomId) {
          room = this.chatrooms.find((r) => r.id === roomId);
        }

        if (roomId && room) {
          this.selectedRoom = room;
        } else {
          if (this.chatrooms.length > 0) {
            this.selectedRoom = this.chatrooms[0];
            localStorage.setItem('selectedRoomId', this.selectedRoom.id);
          } else {
            this.selectedRoom = null;
            localStorage.removeItem('selectedRoomId');
          }
        }
      }
    },

    pushChatroom(room) {
      if (room) {
        this.chatrooms.push(room);
        this.selectedRoom = room;
        localStorage.setItem('selectedRoomId', this.selectedRoom.id);
      }
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
        localStorage.setItem('selectedRoomId', this.selectedRoom.id);
      }
    },

    async removeUser(roomId) {
      const response = await removeUserFromChatroom(roomId);
      if (response) {
        this.chatrooms = this.chatrooms.filter((cr) => cr.id != roomId);
        if (this.chatrooms.length > 0) {
          this.selectedRoom = this.chatrooms[0];
          localStorage.setItem('selectedRoomId', this.selectedRoom.id);
        } else {
          this.selectedRoom = null;
          localStorage.removeItem('selectedRoomId');
        }
      }
    },

    selectRoom(room) {
      this.selectedRoom = room;
      if (room) {
        localStorage.setItem('selectedRoomId', room.id);
      } else {
        localStorage.removeItem('selectedRoomId');
      }
    },

    clear() {
      this.chatrooms = [];
      this.selectedRoom = null;
      localStorage.removeItem('selectedRoomId');
    },
  },
});
