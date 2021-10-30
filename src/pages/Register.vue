<template>
  <q-page class="bg-teal window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Chat app</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1 login-card">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                dense
                square
                filled
                clearable
                type="email"
                label="Email"
                v-model="state.email"
              />
              <q-input
                dense
                square
                filled
                clearable
                type="password"
                label="Password"
                v-model="state.password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md row justify-center">
            <q-btn unelevated color="light-green-7" label="Register" @click="register" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Have an account? Sign in.</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import firebase from "firebase";
import { Notify } from "quasar";

export default defineComponent({
  name: "Register",
  setup() {
    const state = reactive({
      email: null,
      password: null,
      loading: false
    });

    const register = async () => {
      try {
        state.loading = true;
        const data = await firebase
          .auth()
          .createUserWithEmailAndPassword(state.email, state.password);
        data.user.updateProfile({
          displayName: state.email
        });
        Notify.create({
          message: "You have successfully created an account",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: e.message,
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } finally {
        state.loading = false;
      }
    };

    return {
      register,
      state
    };
  }
});
</script>

<style lang="scss" scoped>
.login-card {
  width: 700px;
}
</style>
