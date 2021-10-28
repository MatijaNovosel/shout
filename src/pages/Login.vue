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
              <q-input dense square filled clearable type="email" label="email" />
              <q-input dense square filled clearable type="password" label="password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md row justify-center">
            <q-btn unelevated color="light-green-7" label="Login" />
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login"
});
</script>

<style lang="scss" scoped>
.login-card {
  width: 700px;
}
</style>
