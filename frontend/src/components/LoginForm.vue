<template>
  <div class="container login-form">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4>Login</h4>
          </div>
          <div class="card-body">
            <form>
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
                @click.prevent="login()"
              >
                Login
              </button>
              <router-link to="/registration" class="btn btn-secondary ms-2"
                >Register</router-link
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

const email = ref('');
const password = ref('');

async function login() {
  if (email.value && password.value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      alert('Invalid email format');
    } else {
      if (await authStore.login(email.value, password.value)) {
        router.push('/home');
      } else {
        alert("Couldn't log in");
      }
    }
  } else {
    alert('Enter email and password');
  }
}

onBeforeMount(async () => {
  try {
    if ((await authStore.refreshAccessToken()) && authStore.me) {
      router.push('/home');
      return;
    }
  } catch (error) {
    console.log('Error in login page onBeforeMount', { error });
  }
});
</script>

<style>
@media only screen and (max-width: 900px) {
  .login-form {
    width: 80%;
  }
}
</style>
