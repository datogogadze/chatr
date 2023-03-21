<template>
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="card-header bg-primary text-white"> #{{ room.name }}</div>
            <div class="card-body messages-container" ref="chatBox">
              <div v-for="message in messages" :key="message.id">
                <p>
                  <strong>{{ message.user }}:</strong> {{ message.text }}
                </p>
                <hr>
              </div>
            </div>
            <div class="card-footer d-flex">
              <form class="w-100" @submit.prevent="sendMessage">
                <div class="form-group d-flex align-items-center">
                  <input type="text" class="form-control flex-grow-1" placeholder="Type your message here..." v-model="newMessage">
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
  export default {
    name: "ChatRoom",
    components: {
      
    },
    props: {
      room: {
        required: true
      }
    },
    data() {
      return {
        messages: [
          { id: 1, user: 'John', text: 'Hello everyone!' },
          { id: 2, user: 'Mary', text: 'Hi John, how are you?' },
          { id: 3, user: 'Peter', text: 'Hey guys, what are you up to?' },
        ],
        newMessage: '',
      }
    },
    methods: {
      sendMessage() {
        console.log(this.id);
        if (!this.newMessage) return
  
        const message = {
          id: Date.now(),
          user: 'You',
          text: this.newMessage,
        }
  
        this.messages.push(message)
        this.newMessage = ''
  
        // Scroll to bottom of chat box
        this.$nextTick(() => {
          const chatBox = this.$refs.chatBox
          chatBox.scrollTop = chatBox.scrollHeight
        })
      },
    },
  }
  </script>