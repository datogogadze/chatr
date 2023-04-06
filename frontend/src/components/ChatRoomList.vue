<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col">
        <div class="card chatroom-list-card">
          <div>
            <div class="card-header mt-1 mb-1" style="text-align: center">
              Chat Rooms
            </div>
            <div class="list-group chatroom-names-list">
              <button
                type="button"
                class="list-group-item list-group-item-action chatroom-name"
                v-bind:class="
                  room.id == chatroomStore.getSelectedRoomId ? 'active' : ''
                "
                v-for="room in chatroomStore.chatrooms"
                :key="room.id"
                @click="chatroomStore.selectRoom(room)"
              >
                <div class="chatroom-name-text">{{ '# ' + room.name }}</div>
                <button
                  v-if="
                    authStore.me &&
                    authStore.me.id === room.creator_id &&
                    room.id === chatroomStore.getSelectedRoomId
                  "
                  type="button"
                  class="btn"
                  style="float: right"
                  @click="chatroomStore.deleteRoom(room.id)"
                >
                  <i class="bi bi-trash" style="color: white"></i>
                </button>
              </button>
            </div>
          </div>

          <div class="card-footer">
            <button
              type="button"
              class="btn btn-primary mt-1 mb-1"
              @click="showCreateRoomModal = true"
            >
              <i class="bi bi-plus-lg me-2"></i> Create Room
            </button>
          </div>
        </div>
      </div>
      <div
        class="modal create-chatroom"
        :class="{ 'd-block': showCreateRoomModal }"
      >
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

<style>
.create-chatroom {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 600px;
  max-height: 400px;
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  box-shadow: 5px 5px 5px #888888;
}

.chatroom-list-card {
  padding: 5px;
  border-radius: 5px;
  width: 350px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 5px 5px 5px #888888;
}

.chatroom-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
}

.chatroom-name-text {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.row > * {
  padding-left: 0;
  padding-right: 0;
}

.chatroom-names-list {
  overflow-y: auto;
  height: 450px;
}
</style>
