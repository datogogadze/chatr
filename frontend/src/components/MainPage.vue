<template>
  <div class="main-page">
    <div class="chatroom-list">
      <ChatRoomList />
    </div>
    <div class="chatroom">
      <ChatRoom />
    </div>
  </div>
</template>

<script>
import ChatRoomList from './ChatRoomList.vue';
import ChatRoom from './ChatRoom.vue';

export default {
  name: 'App',
  components: {
    ChatRoomList,
    ChatRoom,
  },
};
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

html,
body {
  height: 100%;
}
</style>
