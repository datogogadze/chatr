<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4>Register</h4>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                />
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="register(email, password)"
              >
                Register
              </button>
              <router-link to="/login" class="btn btn-secondary ms-2"
                >Login</router-link
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';

const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');

async function register() {
  if (username.value && email.value && password.value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      alert('Invalid email format');
    } else {
      if (
        await authStore.register(username.value, email.value, password.value)
      ) {
        router.push('/home');
      } else {
        alert("Couldn't register");
      }
    }
  } else {
    alert('Enter email and password');
  }
}

const LOGGED_IN = 'logged-in';

onBeforeMount(async () => {
  if (localStorage.getItem(LOGGED_IN) === 'true') {
    router.push('/home');
    return;
  }
});
</script>
