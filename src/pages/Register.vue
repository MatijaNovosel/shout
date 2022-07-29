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
                v-model="values.email"
                :error="submitCount > 0 && errors.email !== undefined"
                :error-message="errors.email"
                :hide-bottom-space="submitCount == 0 || errors.email === undefined"
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
                v-model="values.username"
                :error="submitCount > 0 && errors.username !== undefined"
                :error-message="errors.username"
                :hide-bottom-space="submitCount == 0 || errors.username === undefined"
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
                v-model="values.password"
                :error="submitCount > 0 && errors.password !== undefined"
                :error-message="errors.password"
                :hide-bottom-space="submitCount == 0 || errors.password === undefined"
              />
            </q-card-section>
            <q-card-actions class="q-px-md row justify-center">
              <q-btn
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
                      name: loginRoute
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
import { useForm } from "vee-validate";
import * as yup from "yup";
import UserService from "src/services/users";
import { useI18n } from "vue-i18n";
import { supabase } from "../supabase";

const { t } = useI18n();

const schema = yup.object({
  email: yup.string().required().email().nullable().label("Email"),
  username: yup.string().required().min(4).nullable().label("Username"),
  password: yup.string().required().min(6).nullable().label("Password")
});

const { handleSubmit, errors, values, submitCount, resetForm } = useForm({
  validationSchema: schema
});

const state = reactive({
  loading: false
});

const onSubmit = handleSubmit(async () => {
  try {
    state.loading = true;
    // const data = await firebase.auth().createUserWithEmailAndPassword(values.email, values.password);
    const data = {};

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password
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

    resetForm({
      values: {
        email: null,
        password: null,
        username: null
      }
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
});
</script>

<style lang="scss" scoped>
.login-card {
  width: 700px;
  border-radius: 8px !important;
}
</style>
