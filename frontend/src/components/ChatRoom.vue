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
          <div
            class="card-body messages-container"
            ref="chatBox"
            @scroll="handleScroll"
          >
            <div v-if="messageStore.messages_loading" class="h-100">
              <div class="spinner">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
            </div>
            <div v-for="message in messageStore.messages" :key="message.id">
              <p>
                <strong
                  >{{
                    message.sender_name === authStore?.me.username
                      ? 'me'
                      : message.sender_name
                  }}:</strong
                >
                {{ message.text }}
              </p>
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
                  ref="inputBox"
                />
                <button type="submit" class="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
        <div class="card chatroom-card" v-else>
          <div class="h-100">
            <h3 class="loading">Loading</h3>
            <div class="spinner">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { useChatRoomStore } from '@/stores/chatroom.store';
import { useMessageStore } from '@/stores/message.store';
import { ref, watch, onBeforeUnmount, onBeforeMount, onUpdated } from 'vue';
import { io } from 'socket.io-client';

let socket = null;

const chatroomStore = useChatRoomStore();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const newMessage = ref('');
const isSocketOpen = ref(false);
const chatBox = ref(null);
const inputBox = ref(null);
let userHasScrolled = false;

const sendMessage = async () => {
  if (!newMessage.value) return;

  const message = {
    sender_id: authStore.me.id,
    sender_name: authStore.me.username,
    chatroom_id: chatroomStore.getSelectedRoomId,
    text: newMessage.value,
    created_at: new Date(),
  };

  socket.emit('message', message);
  newMessage.value = '';
};

const scrollToBottom = () => {
  if (!chatBox.value) return;
  chatBox.value.scrollTop = chatBox.value.scrollHeight;
  if (!inputBox.value) return;
  inputBox.value.focus();
};

const handleScroll = () => {
  if (!chatBox.value) return;
  const isAtTop = chatBox.value.scrollTop === 0;
  if (
    isAtTop &&
    !messageStore.messages_loading &&
    chatroomStore.getSelectedRoomId
  ) {
    userHasScrolled = true;
    messageStore.fetchMessages(
      chatroomStore.getSelectedRoomId,
      messageStore.oldest_message_timestamp
    );
  }
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

        messageStore.clear();
        userHasScrolled = false;
        messageStore.fetchMessages(
          newVal.id,
          messageStore.oldest_message_timestamp
        );
        setTimeout(() => {
          scrollToBottom();
        }, 1000);
      }
    } catch (error) {
      console.log('Error in chatroom watch', { error });
    }
  }
);

onUpdated(() => {
  if (!userHasScrolled) {
    scrollToBottom();
  }
});

onBeforeMount(() => {
  try {
    socket = io(process.env.VUE_APP_API_URL, {
      auth: {
        token: `Bearer ${authStore.access_token.access_token}`,
      },
    });
  } catch (error) {
    console.log(socket);
  }

  socket.on('connect', () => {
    isSocketOpen.value = true;
    if (chatroomStore.getSelectedRoomId) {
      socket.emit('join', chatroomStore.getSelectedRoomId);
    }
  });

  socket.on('message', (message) => {
    userHasScrolled = false;
    messageStore.pushMessage(message);
  });

  socket.on('error', (error) => {
    console.log('WebSocket error:', error);
    isSocketOpen.value = false;
  });

  socket.on('connect_error', (error) => {
    console.log('Connection failed:', error);
    isSocketOpen.value = false;
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
.messages-container::-webkit-scrollbar {
  display: none;
}

.messages-container {
  height: 600px;
  overflow-y: auto;
}

.chatroom-card {
  width: 700px;
  height: 600px;
  box-shadow: 5px 5px 5px #888888;
  position: relative;
}

.row > * {
  padding-left: 0;
  padding-right: 0;
}

.loading {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.spinner {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
</style>
