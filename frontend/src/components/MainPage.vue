<template>
  <div class="main-page" v-if="authenticated">
    <div class="main-page-content">
      <nav class="navbar navbar-light bg-light top-navbar mt-3">
        <div class="container-fluid">
          <div style="display: flex">
            <a class="navbar-brand" href="#">Speakr</a>
            <button
              class="navbar-toggler top-navbar-toggle"
              type="button"
              @click="showChatRoomList = !showChatRoomList"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
          <div class="d-flex">
            <div class="logout-button">
              <button
                class="btn btn-outline-secondary mt-1"
                @click="logout"
                style="display: flex"
              >
                <i class="bi bi-box-arrow-right me-1"></i>
                <div class="logout-text">Logout</div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div class="main-page-body">
        <div class="chatroom-list" :class="{ visible: showChatRoomList }">
          <ChatRoomList />
        </div>
        <div class="chatroom">
          <ChatRoom />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChatRoomList from './ChatRoomList.vue';
import ChatRoom from './ChatRoom.vue';
import { onBeforeMount, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';

const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  router.push('/login');
}

const authenticated = ref(false);
const showChatRoomList = ref(false);

onBeforeMount(async () => {
  try {
    authenticated.value = await authStore.refreshAccessToken();
  } catch (error) {
    console.log('Error in main page onBeforeMount', { error });
  }
});
</script>

<style>
.main-page {
  display: flex;
  justify-content: center;
  background-color: rgb(216, 215, 215);
  width: 100%;
  min-height: 100%;
}

.main-page-body {
  position: relative;
  width: 1100px;
  display: flex;
  justify-content: space-between;
  background-color: rgb(216, 215, 215);
}

.top-navbar {
  width: 1100px;
  box-shadow: 5px 5px 5px #888888;
  z-index: 1;
}

.main-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

@media only screen and (max-width: 1200px) {
  .main-page-body {
    width: 800px;
  }

  .chatroom-card {
    width: 500px;
  }

  .chatroom-list-card {
    width: 250px;
  }

  .top-navbar {
    width: 800px;
  }
}

@media only screen and (max-width: 900px) {
  .chatroom-list {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    background-color: transparent;
    transform: translateX(-100%);
    transition: transform 0.1s ease-out, visibility 0s linear 0.1s;
    visibility: hidden;
  }

  .chatroom-list.visible {
    transform: translateX(0%);
    visibility: visible;
    transition: transform 0.1s ease-out, visibility 0s linear 0s;
  }

  .main-page-body {
    width: 500px;
  }

  .top-navbar {
    width: 500px;
  }

  .chatroom-card {
    width: 500px;
  }

  .logout-text {
    display: none;
  }
}

@media only screen and (max-width: 550px) {
  .main-page-body {
    width: 250px;
  }

  .top-navbar {
    width: 250px;
  }

  .chatroom-card {
    width: 250px;
  }
}

@media only screen and (max-width: 900px) {
  .top-navbar-toggle {
    display: block;
  }
}

@media only screen and (min-width: 901px) {
  .top-navbar-toggle {
    display: none;
  }
}

html,
body {
  height: 100%;
  width: 100%;
}
</style>
