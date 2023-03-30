<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-6 offset-md-5">
        <div class="card">
          <div class="card-header">Chat Rooms</div>
          <div class="list-group">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              v-bind:class="room.id == store.getSelectedRoomId ? 'active' : ''"
              v-for="room in store.chatrooms"
              :key="room.id"
              @click="store.selectRoom(room)"
            >
              #{{ room.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useChatRoomStore } from '@/stores/chatroom';

const store = useChatRoomStore();

onMounted(async () => {
  try {
    await store.fetchChatrooms();
  } catch (error) {
    console.log({ error });
  }
});
</script>

<style></style>
