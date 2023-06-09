<template>
  <div class="container">
    <div class="row">
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
                :class="{ active: room.id == chatroomStore.getSelectedRoomId }"
                v-for="room in chatroomStore.chatrooms"
                :key="room.id"
                @click="() => chatroomStore.selectRoom(room)"
              >
                <div class="chatroom-name-text">{{ '# ' + room.name }}</div>
                <button
                  v-if="room.id === chatroomStore.getSelectedRoomId"
                  type="button"
                  class="btn"
                  style="float: right"
                  @click="chatroomStore.removeUser(room.id)"
                >
                  <i class="bi bi-trash" style="color: white"></i>
                </button>
              </button>
            </div>
          </div>

          <div class="card-footer">
            <button
              type="button"
              class="btn btn-primary mt-1 mb-1 add-button d-flex align-items-center"
              @click="handleAddButtonClick"
              ref="createButton"
            >
              <i class="bi bi-plus-lg"></i>
              <div class="add-text ms-2">Add</div>
            </button>
            <button
              type="button"
              class="btn btn-primary mt-1 mb-1 find-button"
              @click="handleFindButtonClick"
              ref="findButton"
            >
              <i class="bi bi-search"></i>
              <div class="find-text ms-2">Find</div>
            </button>
          </div>
        </div>
      </div>
      <div
        class="modal create-chatroom"
        :class="{ 'd-block': showCreateRoomModal }"
        ref="createModal"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create New Chat Room</h5>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="showCreateRoomModal = false"
              >
                <i class="bi bi-x bi-sm"></i>
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
                  @keypress.enter="createRoom"
                  ref="createInput"
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
      <div
        class="modal find-chatroom"
        :class="{ 'd-block': showFindRoomModal }"
        ref="findModal"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Find Chat Room</h5>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="showFindRoomModal = false"
              >
                <i class="bi bi-x bi-sm"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group mb-10">
                <label for="roomName">Room Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="roomName"
                  v-model="searchTerm"
                  @input="findRoom"
                  ref="findInput"
                />
              </div>
              <div class="search-results">
                <ul class="list-group">
                  <li
                    v-for="room in searchResults"
                    :key="room.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>{{ '# ' + room.name }}</div>
                    <button
                      v-if="isNotJoined(room.id)"
                      type="button"
                      class="btn btn-primary"
                      @click="() => joinRoom(room.id)"
                    >
                      <i class="bi bi-plus-lg me-2"></i> Join
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useChatRoomStore } from '@/stores/chatroom.store';
import { useAuthStore } from '@/stores/auth.store';
import { findChatrooms, addUserToRoom } from '@/api/api';

const chatroomStore = useChatRoomStore();
const authStore = useAuthStore();

const showCreateRoomModal = ref(false);
const showFindRoomModal = ref(false);
const newRoomName = ref('');
const searchResults = ref([]);
const searchTerm = ref('');
const createInput = ref(null);
const findInput = ref(null);
const createModal = ref(null);
const findModal = ref(null);
const createButton = ref(null);
const findButton = ref(null);

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

const findRoom = async () => {
  if (searchTerm.value.length >= 1) {
    const data = await findChatrooms(searchTerm.value);
    searchResults.value = data;
  } else {
    searchResults.value = [];
  }
};

const joinRoom = async (roomId) => {
  const joined = await addUserToRoom(roomId);
  if (joined) {
    chatroomStore.pushChatroom(joined);
  } else {
    alert("Couldn't join");
  }
};

const isNotJoined = (roomId) => {
  const hasRoom = chatroomStore.chatrooms.find((r) => r.id === roomId);
  if (hasRoom) {
    return false;
  }
  return true;
};

const closeModals = () => {
  showCreateRoomModal.value = false;
  showFindRoomModal.value = false;
};

const handleAddButtonClick = () => {
  if (showFindRoomModal.value) {
    showCreateRoomModal.value = false;
  } else {
    showCreateRoomModal.value = true;
  }
  if (createInput.value) {
    setTimeout(() => createInput.value.focus(), 1);
  }
};

const handleFindButtonClick = () => {
  if (showCreateRoomModal.value) {
    showFindRoomModal.value = false;
  } else {
    showFindRoomModal.value = true;
  }
  if (findInput.value) {
    setTimeout(() => findInput.value.focus(), 1);
  }
};

onMounted(async () => {
  try {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModals();
      }
    });

    window.addEventListener('click', (event) => {
      if (showCreateRoomModal.value && createModal.value === event.target) {
        showCreateRoomModal.value = false;
      }
      if (showFindRoomModal.value && findModal.value === event.target) {
        showFindRoomModal.value = false;
      }
    });

    chatroomStore.addChatrooms(authStore?.me.chatrooms);
  } catch (error) {
    console.log('Error in chatroom list onMounted', { error });
  }
});

watch(
  () => showFindRoomModal.value,
  (newVal) => {
    if (!newVal) {
      searchResults.value = [];
      searchTerm.value = '';
    }
  }
);
</script>

<style>
.create-chatroom {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border: 1px solid black;
  box-shadow: 5px 5px 5px #888888;
}

.find-chatroom {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border: 1px solid black;
  box-shadow: 5px 5px 5px #888888;
}

.search-results {
  max-height: 400px;
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
  gap: 40px;
}

.row > * {
  padding-left: 0;
  padding-right: 0;
}

.chatroom-names-list::-webkit-scrollbar {
  display: none;
}

.chatroom-names-list {
  overflow-y: auto;
  height: 450px;
}

.search-result {
  display: flex;
  justify-content: space-between;
}

.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.find-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 1200px) {
  .add-text {
    display: none;
  }

  .find-text {
    display: none;
  }
}
</style>
