<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-8 offset-md-0">
        <div class="card" v-if="chatroomStore.selectedRoom">
          <div class="card-header bg-primary text-white">
            #{{
              chatroomStore.selectedRoom
                ? chatroomStore.selectedRoom.name
                : 'room'
            }}
          </div>
          <div class="card-body messages-container" ref="chatBox">
            <div v-for="message in messageStore.messages" :key="message.id">
              <p>
                <strong>{{ message.user }}:</strong> {{ message.text }}
              </p>
              <hr />
            </div>
          </div>
          <div class="card-footer d-flex">
            <form class="w-100" @submit.prevent="sendMessage">
              <div class="form-group d-flex align-items-center">
                <input
                  type="text"
                  class="form-control flex-grow-1"
                  placeholder="Type your message here..."
                  v-model="newMessage"
                />
                <button type="submit" class="btn btn-primary ml-2">Send</button>
              </div>
            </form>
          </div>
        </div>
        <div class="card" style="height: 200px; text-align: center" v-else>
          <h3 class="mt-3">No avaliable chatrooms</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.messages-container {
  height: 500px;
  overflow-y: auto;
}
</style>

<script setup>
import { useChatRoomStore } from '@/stores/chatroom';
import { useMessageStore } from '@/stores/message';
import { ref, watch } from 'vue';

const chatroomStore = useChatRoomStore();
const messageStore = useMessageStore();

const newMessage = ref('');

const sendMessage = () => {
  if (!newMessage.value) return;

  const message = {
    id: Date.now(),
    user: 'You',
    text: newMessage.value,
  };

  messageStore.pushMessage(message);
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
  async (newVal) => {
    try {
      await messageStore.fetchMessages(newVal.id);
      scrollToBottom();
    } catch (error) {
      console.log('Error in chatroom watch', { error });
    }
  }
);
</script>
<style></style>
