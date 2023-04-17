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
            <div v-for="(value, key) in messageStore.messages" :key="key">
              <div class="day" v-if="value.length > 0">
                {{ getDayStart(value[0].created_at) }}
              </div>
              <div
                v-for="(message, index) in value"
                :key="message.id"
                v-bind:class="
                  authStore.me.id === message.sender_id
                    ? 'right-message'
                    : 'left-message'
                "
              >
                <div class="message-content">
                  <div
                    v-bind:class="
                      authStore.me.id === message.sender_id
                        ? 'left-tooltip'
                        : 'right-tooltip'
                    "
                  >
                    {{ getFullDate(message.created_at) }}
                  </div>

                  <div
                    v-if="shouldShowName(message, value[index - 1], index)"
                    class="sender"
                  >
                    {{ message.sender_name }}
                  </div>
                  <div
                    class="sent-text"
                    v-bind:class="
                      authStore.me.id === message.sender_id
                        ? 'blue-text'
                        : 'grey-text'
                    "
                  >
                    {{ message.text }}
                  </div>
                </div>
              </div>
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

const getFullDate = (created_at) => {
  const date = new Date(created_at);
  const options = {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleString('en-US', options);
};

const getDayStart = (created_at) => {
  const date = new Date(created_at);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const shouldShowName = (message, prev, index) => {
  return (
    message.sender_name !== authStore?.me.username &&
    (index === 0 ||
      prev.sender_name != message.sender_name ||
      new Date(message.created_at).getTime() -
        new Date(prev.created_at).getTime() >
        60000)
  );
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

.day {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 12px;
  color: grey;
}

.left-message {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.right-message {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.message-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.message-content:hover .right-tooltip {
  opacity: 1;
}

.message-content:hover .left-tooltip {
  opacity: 1;
}

.right-tooltip {
  position: absolute;
  pointer-events: none;
  bottom: 12px;
  left: calc(100% + 15px);
  width: 85px;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  font-size: 12px;
}

.left-tooltip {
  position: absolute;
  pointer-events: none;
  bottom: 12px;
  right: calc(100% + 15px);
  width: 85px;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  font-size: 12px;
}

.sender {
  font-size: 12px;
  color: grey;
  margin-left: 10px;
  margin-top: 10px;
}

.grey-text {
  background-color: #e4e6eb;
  color: black;
}

.blue-text {
  background-color: #0086fd;
  color: white;
}

.sent-text {
  border-radius: 20px;
  padding: 10px 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 1px;
  font-size: 16px;
}
</style>
