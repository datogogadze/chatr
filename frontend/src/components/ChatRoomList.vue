	<template>
			<div class="row">
				<div class="col-md-4">
					<div class="card">
						<div class="card-header">Chat Rooms</div>
						<div class="list-group">
							<button type="button" 
											class="list-group-item list-group-item-action"
											v-bind:class="(room.id == selectedRoomInfo.id) ? 'active' : ''"
											v-for="room in rooms" :key="room.id"
											@click="selectRoom(room)">
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
  import ChatRoom from './ChatRoom.vue'
  
  export default {
    name: 'ChatroomList',
    components: {
      ChatRoom
    },
    data() {
			const rooms = [
          { id: "1", name: 'General' },
          { id: "2", name: 'Random' },
          { id: "3", name: 'Music' }
        ] 
      return {
        rooms,
        selectedRoomInfo: rooms.length > 0 ? rooms[0] : null,
      }
    },
    methods: {
      selectRoom(room) {
        this.selectedRoomInfo = room;
      }
    },
    computed: {
        selectedRoom() {
            return this.rooms.find((room) => room.id === this.selectedRoomInfo.id);
        },
    },    
  }
  </script>
  
  <style>
  </style>