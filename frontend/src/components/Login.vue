<template>
  <div class="container">
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

<script>
import { ref } from 'vue';
import { loginUser } from '@/api/api';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('');
    const password = ref('');

    function login() {
      if (email.value && password.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
          alert('Invalid email format');
        } else {
          loginUser(email.value, password.value);
        }
      } else {
        alert('Enter email and password');
      }
    }

    return {
      email,
      password,
      login,
    };
  },
};
</script>
