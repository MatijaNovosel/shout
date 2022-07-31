<template>
  <q-page class="bg-black window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card dark square bordered class="q-pa-lg shadow-1 login-card no-border">
          <q-form class="q-gutter-md" @submit="onSubmit" autocomplete="off">
            <q-card-section>
              <q-input
                dark
                dense
                square
                filled
                clearable
                name="email"
                type="email"
                :label="$t('email')"
                v-model="state.auth.email"
                :error="$v.email.$error"
                :error-message="collectErrors($v.email.$errors)"
                :hide-bottom-space="!$v.email.$error"
              />
              <q-input
                dark
                dense
                square
                filled
                clearable
                class="q-my-md"
                name="username"
                :label="$t('username')"
                v-model="state.auth.username"
                :error="$v.username.$error"
                :error-message="collectErrors($v.username.$errors)"
                :hide-bottom-space="!$v.username.$error"
              />
              <q-input
                dark
                dense
                square
                filled
                clearable
                name="password"
                type="password"
                :label="$t('password')"
                v-model="state.auth.password"
                :error="$v.password.$error"
                :error-message="collectErrors($v.password.$errors)"
                :hide-bottom-space="!$v.password.$error"
              />
            </q-card-section>
            <q-card-actions class="q-px-md row justify-center">
              <q-btn
                :disable="$v.$invalid"
                :loading="state.loading"
                type="submit"
                unelevated
                color="light-green-7"
                :label="$t('register')"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
              <p class="text-grey-6">
                {{ $t("haveAnAccount") }}
                <span
                  class="text-orange text-bold cursor-pointer"
                  @click="
                    $router.push({
                      name: ROUTE_NAMES.LOGIN
                    })
                  "
                >
                  {{ $t("signIn") }}
                </span>
              </p>
            </q-card-section>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from "vue";
import { Notify } from "quasar";
import { useI18n } from "vue-i18n";
import { supabase } from "src/supabase";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { ROUTE_NAMES } from "src/router/routeNames";
import { collectErrors } from "src/utils/helpers";

const { t } = useI18n();

const state = reactive({
  loading: false,
  auth: {
    email: null,
    password: null,
    username: null
  }
});

const rules = {
  username: { required, $autoDirty: true },
  password: { required, $autoDirty: true },
  email: { required, email, $autoDirty: true }
};

const $v = useVuelidate(rules, state.auth);

const onSubmit = async () => {
  try {
    state.loading = true;

    const { error } = await supabase.auth.signUp({
      email: state.auth.email,
      password: state.auth.password
    });

    if (error) {
      throw error;
    }

    Notify.create({
      message: t("createdAccount"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });

    state.auth.email = null;
    state.auth.password = null;
    state.auth.username = null;

    $v.value.$reset();
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
</script>

<style lang="scss" scoped>
.login-card {
  width: 700px;
  border-radius: 8px !important;
}
</style>
