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
                name="email"
                label="Email"
                v-model="state.email"
              />
              <q-input
                dense
                square
                filled
                clearable
                type="password"
                name="password"
                label="Password"
                v-model="state.password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md row justify-center">
            <q-btn @click="login" unelevated color="light-green-7" label="Login" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Not registered? Create an account</p>
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
import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "src/router/routeNames";

export default defineComponent({
  name: "Login",
  setup() {
    const router = useRouter();

    const state = reactive({
      email: null,
      password: null,
      loading: false
    });

    const login = async () => {
      try {
        state.loading = true;
        await firebase.auth().signInWithEmailAndPassword(state.email, state.password);
        Notify.create({
          message: "You have successfully signed in",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
        router.push({
          name: ROUTE_NAMES.INDEX
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
      login,
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
