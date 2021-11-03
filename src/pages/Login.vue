<template>
  <q-page class="bg-black window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card dark square bordered class="q-pa-lg login-card no-border">
          <q-card-section>
            {{ emailErrors }}
            <q-form class="q-gutter-md">
              <q-input
                dark
                dense
                square
                filled
                clearable
                bottom-slots
                type="email"
                name="email"
                label="Email"
                v-model="email"
                :error-message="emailErrors"
                :error="emailErrors"
              />
              <q-input
                dark
                dense
                square
                filled
                clearable
                bottom-slots
                type="password"
                name="password"
                label="Password"
                v-model="password"
                :error-message="passwordErrors"
                :error="passwordErrors"
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
import { useField } from "vee-validate";
import * as yup from "yup";

export default defineComponent({
  name: "Login",
  setup() {
    const { value: email, errorMesage: emailErrors } = useField(
      "email",
      yup.string().required().email()
    );
    const { value: password, errorMessages: passwordErrors } = useField(
      "password",
      yup.string().required()
    );

    const router = useRouter();

    const state = reactive({
      loading: false
    });

    const login = async () => {
      try {
        state.loading = true;
        await firebase.auth().signInWithEmailAndPassword(email, password);
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
      email,
      password,
      emailErrors,
      passwordErrors
    };
  }
});
</script>
<style lang="scss" scoped>
.login-card {
  width: 700px;
}
</style>
