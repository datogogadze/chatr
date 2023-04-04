<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-6 offset-md-5">
        <div class="card">
          <div class="card-header mt-1 mb-1">Chat Rooms</div>
          <div class="list-group">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              v-bind:class="
                room.id == chatroomStore.getSelectedRoomId ? 'active' : ''
              "
              v-for="room in chatroomStore.chatrooms"
              :key="room.id"
              @click="chatroomStore.selectRoom(room)"
            >
              # {{ room.name }}
              <button
                v-if="
                  authStore.userId === room.creator_id &&
                  room.id === chatroomStore.getSelectedRoomId
                "
                type="button"
                class="close"
                style="float: right"
                @click="chatroomStore.deleteRoom(room.id)"
              >
                <span>&times;</span>
              </button>
            </button>
            <div class="card-footer">
              <button
                type="button"
                class="btn btn-success mt-1 mb-1"
                @click="showCreateRoomModal = true"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" :class="{ 'd-block': showCreateRoomModal }">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create New Chat Room</h5>
              <button
                type="button"
                class="close"
                @click="showCreateRoomModal = false"
              >
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="roomName">Room Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="roomName"
                  v-model="newRoomName"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="createRoom">
                Create
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="showCreateRoomModal = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useChatRoomStore } from '@/stores/chatroom.store';
import { useAuthStore } from '@/stores/auth.store';

const chatroomStore = useChatRoomStore();
const authStore = useAuthStore();

const showCreateRoomModal = ref(false);
const newRoomName = ref('');

const createRoom = async () => {
  try {
    if (newRoomName.value) {
      await chatroomStore.createChatroom(newRoomName.value);
      showCreateRoomModal.value = false;
      newRoomName.value = '';
    } else {
      alert('Enter room name');
    }
  } catch (error) {
    console.log('Error creating chat room', error);
  }
};

onMounted(async () => {
  try {
    await chatroomStore.fetchChatrooms();
  } catch (error) {
    console.log('Error in chatroom list onMounted', { error });
  }
});
</script>

<style></style>
