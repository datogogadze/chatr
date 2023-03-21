<template>
  <div class="row">
    <div class="col-md-4">
      <div class="card">
        <div class="card-header">Chat Rooms</div>
        <div class="list-group">
          <button
            type="button"
            class="list-group-item list-group-item-action"
            v-bind:class="room.id == selectedRoomInfo.id ? 'active' : ''"
            v-for="room in rooms"
            :key="room.id"
            @click="selectRoom(room)"
          >
            #{{ room.name }}
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <ChatRoom v-if="selectedRoom" :room="selectedRoom" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import ChatRoom from './ChatRoom.vue';
import { getAllChatrooms } from '../api/api';

export default {
  name: 'ChatroomList',
  components: {
    ChatRoom,
  },
  setup() {
    const rooms = ref([]);
    const selectedRoomInfo = ref(null);

    const selectRoom = (room) => {
      selectedRoomInfo.value = room;
    };

    const selectedRoom = computed(() => {
      return rooms.value.find((room) => room.id === selectedRoomInfo.value?.id);
    });

    onMounted(async () => {
      try {
        rooms.value = await getAllChatrooms();
        selectedRoomInfo.value = rooms.value.length > 0 ? rooms.value[0] : null;
      } catch (error) {
        console.log({ error });
      }
    });

    return {
      rooms,
      selectedRoomInfo,
      selectRoom,
      selectedRoom,
    };
  },
};
</script>

<style></style>
