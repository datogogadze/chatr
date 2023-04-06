<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col">
        <div
          class="card chatroom-card"
          v-if="chatroomStore.selectedRoom && isSocketOpen"
        >
          <div class="card-header bg-primary text-white">
            {{
              '# ' +
              (chatroomStore.selectedRoom
                ? chatroomStore.selectedRoom.name
                : 'room')
            }}
          </div>
          <div class="card-body messages-container" ref="chatBox">
            <div v-for="message in messageStore.messages" :key="message.id">
              <p>
                <strong
                  >{{
                    message.sender_name === authStore.me &&
                    authStore.me.username
                      ? 'Me'
                      : message.sender_name
                  }}:</strong
                >
                {{ message.text }}
              </p>
              <hr />
            </div>
          </div>
          <div class="card-footer d-flex">
            <form class="w-100" @submit.prevent="sendMessage">
              <div class="form-group d-flex align-items-center">
                <input
                  style="margin-right: 10px"
                  type="text"
                  class="form-control flex-grow-1"
                  placeholder="Type your message here..."
                  v-model="newMessage"
                />
                <button type="submit" class="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
        <div class="card chatroom-card" style="text-align: center" v-else>
          <h3 style="margin-top: 50px">Chatroom not connected</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.messages-container {
  height: 600px;
  overflow-y: auto;
}
</style>

<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { useChatRoomStore } from '@/stores/chatroom.store';
import { useMessageStore } from '@/stores/message.store';
import { ref, watch, onBeforeUnmount, onBeforeMount } from 'vue';
import { io } from 'socket.io-client';

const socket = io(process.env.VUE_APP_API_URL);

const chatroomStore = useChatRoomStore();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const newMessage = ref('');
const isSocketOpen = ref(false);

const sendMessage = () => {
  if (!newMessage.value) return;

  const message = {
    sender_id: authStore.me.id,
    sender_name: authStore.me.username,
    chatroom_id: chatroomStore.getSelectedRoomId,
    text: newMessage.value,
    created_at: new Date(Date.now()),
  };

  // messageStore.pushMessage(message);
  socket.emit('message', message);
  newMessage.value = '';

  scrollToBottom();
};

const chatBox = ref(null);
const scrollToBottom = () => {
  if (!chatBox.value) return;
  chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

watch(
  () => chatroomStore.selectedRoom,
  async (newVal, oldVal) => {
    try {
      if (newVal) {
        if (oldVal) {
          socket.emit('leave', oldVal.id);
        }

        socket.emit('join', newVal.id);

        await messageStore.fetchMessages(newVal.id);
        scrollToBottom();
      }
    } catch (error) {
      console.log('Error in chatroom watch', { error });
    }
  }
);

onBeforeMount(() => {
  socket.on('connect', () => {
    isSocketOpen.value = true;
  });

  socket.on('message', (message) => {
    messageStore.pushMessage(message);
  });

  socket.on('disconnect', () => {
    isSocketOpen.value = false;
  });
});

onBeforeUnmount(() => {
  if (chatroomStore.getSelectedRoomId) {
    socket.emit('leave', chatroomStore.getSelectedRoomId);
  }
  socket.close();
});
</script>
<style>
.chatroom-card {
  width: 700px;
  height: 600px;
  box-shadow: 5px 5px 5px #888888;
}

.row > * {
  padding-left: 0;
  padding-right: 0;
}
</style>
