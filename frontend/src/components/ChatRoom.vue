<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-header bg-primary text-white">#{{ room.name }}</div>
          <div class="card-body messages-container" ref="chatBox">
            <div v-for="message in messages" :key="message.id">
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

<script>
import { ref, onMounted, watch } from 'vue';
import { getAllMessagesForChatroom } from '../api/api';

export default {
  name: 'ChatRoom',
  props: {
    room: {
      required: true,
    },
  },
  setup(props) {
    const messages = ref([]);
    const newMessage = ref('');

    const sendMessage = () => {
      if (!newMessage.value) return;

      const message = {
        id: Date.now(),
        user: 'You',
        text: newMessage.value,
      };

      messages.value.push(message);
      newMessage.value = '';

      scrollToBottom();
    };

    const chatBox = ref(null);
    const scrollToBottom = () => {
      if (!chatBox.value) return;
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    };

    onMounted(async () => {
      try {
        messages.value = await getAllMessagesForChatroom(props.room.id);
        scrollToBottom();
      } catch (error) {
        console.log({ error });
      }
    });

    watch(
      () => props.room.id,
      async (newVal) => {
        try {
          messages.value = await getAllMessagesForChatroom(newVal);
          scrollToBottom();
        } catch (error) {
          console.log({ error });
        }
      }
    );

    return {
      messages,
      newMessage,
      sendMessage,
      chatBox,
    };
  },
};
</script>
