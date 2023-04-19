<template>
  <div class="container">
    <div class="row">
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
            <div v-for="[key, value] in messageStore.messages" :key="key">
              <div class="day" v-if="value.length > 0">
                {{ getDayStart(value[0].created_at) }}
              </div>
              <div
                v-for="(message, index) in value"
                :key="message.id"
                :class="
                  authStore.me.id === message.sender_id
                    ? 'right-message'
                    : 'left-message'
                "
              >
                <div class="message-content">
                  <div
                    :class="
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
                    :class="
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
            <div class="w-100">
              <div class="form-group d-flex align-items-center">
                <input
                  @keypress.enter="sendMessage"
                  type="text"
                  class="form-control flex-grow-1"
                  placeholder="Type your message here..."
                  v-model="newMessage"
                  ref="inputBox"
                />
                <button
                  ref="pickerButton"
                  class="btn btn-light border-0 shadow-sm"
                  style="margin-left: 10px"
                  @click="showPicker = !showPicker"
                >
                  <i class="bi bi-emoji-smile"></i>
                </button>
                <div ref="picker" v-if="showPicker">
                  <Picker
                    class="emojies"
                    :data="emojiIndex"
                    :showPreview="false"
                    set="twitter"
                    @select="showEmoji"
                    title="Select emoji"
                    emoji="smile"
                  />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  style="margin-left: 5px"
                  @click="sendMessage"
                >
                  Send
                </button>
              </div>
            </div>
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
import {
  ref,
  watch,
  onBeforeUnmount,
  onBeforeMount,
  onUpdated,
  onMounted,
} from 'vue';
import { io } from 'socket.io-client';

import data from 'emoji-mart-vue-fast/data/twitter.json';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src';
let emojiIndex = new EmojiIndex(data);
/* eslint-disable */
let socket = null;

const chatroomStore = useChatRoomStore();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const newMessage = ref('');
const isSocketOpen = ref(false);
const chatBox = ref(null);
const inputBox = ref(null);
const showPicker = ref(false);
const picker = ref(null);
const pickerButton = ref(null);
let userHasScrolled = false;
const saveScroll = ref(0);

const showEmoji = (emoji) => {
  newMessage.value += emoji.native;
};

const sendMessage = async () => {
  if (!newMessage.value) return;

  newMessage.value = newMessage.value.substring(0, 256);
  const words = newMessage.value.split(' ');
  let messageText = '';
  words.forEach((w) => {
    if (emojiIndex._emoticons[w]) {
      messageText += emojiIndex.findEmoji(
        `:${emojiIndex._emoticons[w]}:`
      ).native;
    } else {
      messageText += w;
    }
  });

  const message = {
    sender_id: authStore.me.id,
    sender_name: authStore.me.username,
    chatroom_id: chatroomStore.getSelectedRoomId,
    text: messageText,
    created_at: new Date(),
  };

  socket.emit('message', message);
  newMessage.value = '';
  showPicker.value = false;
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

    // if (chatBox.value.scrollHeight - saveScroll.value < 100)
    if (chatBox.value.scrollHeight - saveScroll.value < 100) {
      return;
    }
    saveScroll.value = chatBox.value.scrollHeight;
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
  } else if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight - saveScroll.value;
  }
});

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      showPicker.value = false;
    }
  });

  window.addEventListener('click', (event) => {
    if (showPicker.value) {
      const pickerClicked = pickerButton.value.contains(event.target);
      if (pickerClicked) return;

      const clikcedInsidePicker = picker.value.contains(event.target);
      if (!clikcedInsidePicker) {
        showPicker.value = false;
      }
    }
  });
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

.emojies {
  width: 300px !important;
  height: 350px;
  position: absolute;
  right: 10px;
  bottom: 60px;
}

@media only screen and (max-width: 550px) {
  .emojies {
    width: 270px !important;
    height: 300px;
    right: 0px;
  }
}
</style>
