<template>
  <q-page class="bg-black window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card dark square bordered class="q-pa-lg login-card no-border">
          <q-form class="q-gutter-md" @submit="onSubmit">
            <q-card-section class="text-white">
              <q-input
                dark
                dense
                square
                filled
                clearable
                type="email"
                name="email"
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
                type="password"
                name="password"
                :label="$t('password')"
                class="q-mt-md"
                v-model="state.auth.password"
                :error="$v.password.$error"
                :error-message="collectErrors($v.password.$errors)"
                :hide-bottom-space="!$v.password.$error"
              />
            </q-card-section>
            <q-card-actions class="row justify-center q-mt-none">
              <q-btn
                :disable="$v.$invalid"
                :loading="state.loading"
                type="submit"
                unelevated
                color="light-green-7"
                :label="$t('login')"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
              <p class="text-grey-6">
                {{ $t("notRegistered") }}
                <span
                  class="text-orange text-bold cursor-pointer"
                  @click="
                    $router.push({
                      name: ROUTE_NAMES.REGISTER
                    })
                  "
                >
                  {{ $t("createAnAccount") }}
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
import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "src/router/routeNames";
import { useStore } from "vuex";
import UserService from "src/services/users";
import { useI18n } from "vue-i18n";
import { supabase } from "src/supabase";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { collectErrors } from "src/utils/helpers";

const store = useStore();
const router = useRouter();
const { t } = useI18n();

const state = reactive({
  loading: false,
  auth: {
    email: null,
    password: null
  }
});

const rules = {
  password: { required, $autoDirty: true },
  email: { required, email, $autoDirty: true }
};

const $v = useVuelidate(rules, state.auth);

const onSubmit = async () => {
  try {
    state.loading = true;

    const { user, error } = await supabase.auth.signIn({
      email: state.auth.email,
      password: state.auth.password
    });

    if (error) {
      throw error;
    }

    const details = await UserService.getDetails(user.id);

    store.dispatch("user/fetchUser", {
      id: 1,
      email,
      ...details
    });

    Notify.create({
      message: t("signedIn"),
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
</script>

<style lang="scss" scoped>
.login-card {
  width: 700px;
  border-radius: 8px !important;
}
</style>
