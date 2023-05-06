<template>
  <div class="main-page" v-if="authenticated">
    <div class="main-page-content">
      <nav class="navbar navbar-light bg-light top-navbar mt-3">
        <div class="container-fluid">
          <div style="display: flex">
            <a class="navbar-brand" href="#">Chatr</a>
            <button
              ref="showChatRoomListButton"
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
      <div class="main-page-body mt-5">
        <div
          ref="chatroomList"
          class="chatroom-list"
          :class="{ visible: showChatRoomList }"
        >
          <ChatRoomList />
        </div>
        <div class="chatroom">
          <ChatRoom />
        </div>
      </div>
    </div>
  </div>
  <div class="main-page-error" v-else>
    <div class="h-100">
      <h3 class="loading">Loading</h3>
      <div class="spinner">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChatRoomList from './ChatRoomList.vue';
import ChatRoom from './ChatRoom.vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';
import { useMessageStore } from '@/stores/message.store';
import { useChatRoomStore } from '@/stores/chatroom.store';

const authStore = useAuthStore();
const showChatRoomListButton = ref(null);

async function logout() {
  useChatRoomStore().clear();
  useMessageStore().clear();
  await authStore.logout();
  router.push('/login');
}

const authenticated = ref(false);
const showChatRoomList = ref(false);
const chatroomList = ref(null);

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      showChatRoomList.value = false;
    }
  });

  window.addEventListener('click', (event) => {
    if (showChatRoomList.value) {
      const showClicked = showChatRoomListButton.value.contains(event.target);
      if (showClicked) return;

      const clikcedInsideList = chatroomList.value.contains(event.target);
      if (!clikcedInsideList) {
        showChatRoomList.value = false;
      }
    }
  });
});

onBeforeMount(async () => {
  try {
    authenticated.value = await authStore.refreshAccessToken();
    if (!authenticated.value) {
      router.push('/login');
    }
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
    width: 270px;
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
    width: 270px;
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
    width: 270px;
  }

  .top-navbar {
    width: 270px;
  }

  .chatroom-card {
    width: 270px;
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

.main-page-error {
  position: relative;
  width: 100%;
  height: 100%;
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

html,
body {
  height: 100%;
  width: 100%;
}
</style>
