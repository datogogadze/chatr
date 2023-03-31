<template>
  <div class="main-page">
    <div class="chatroom-list">
      <ChatRoomList />
    </div>
    <div class="chatroom">
      <ChatRoom />
    </div>
    <div class="logout-button">
      <button class="btn btn-danger mt-5" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import ChatRoomList from './ChatRoomList.vue';
import ChatRoom from './ChatRoom.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  router.push('/login');
}

onMounted(async () => {
  try {
    if (!(await authStore.refreshAccessToken())) {
      router.push('/login');
      return;
    }
  } catch (error) {
    console.log('Error in main page onBeforeMount', { error });
  }
});
</script>

<style>
.main-page {
  display: flex;
  justify-content: space-between;
  background-color: rgb(216, 215, 215);
  width: 100%;
  height: 100%;
}

.chatroom-list {
  width: 40%;
}

.chatroom {
  width: 60%;
}

.logout-button {
  width: 120px;
}

html,
body {
  height: 100%;
}
</style>
