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

<script>
import { ref } from 'vue';
import { registerUser } from '@/api/api';

export default {
  name: 'RegisterPage',
  setup() {
    const email = ref('');
    const password = ref('');

    function register() {
      if (email.value && password.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
          alert('Invalid email format');
        } else {
          registerUser(email.value, password.value);
        }
      } else {
        alert('Enter email and password');
      }
    }

    return {
      email,
      password,
      register,
    };
  },
};
</script>
