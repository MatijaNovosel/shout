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
                label="Email"
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
                type="password"
                name="password"
                label="Password"
                v-model="values.password"
                class="q-mt-md"
                :error="submitCount > 0 && errors.password !== undefined"
                :error-message="errors.password"
                :hide-bottom-space="submitCount == 0 || errors.password === undefined"
              />
            </q-card-section>
            <q-card-actions class="row justify-center q-mt-none">
              <q-btn type="submit" unelevated color="light-green-7" label="Login" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
              <p class="text-grey-6">
                Not registered?
                <span
                  class="text-teal text-bold cursor-pointer"
                  @click="
                    $router.push({
                      name: registerRoute
                    })
                  "
                >
                  Create an account
                </span>
              </p>
            </q-card-section>
          </q-form>
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
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import UserService from "src/services/users";

export default defineComponent({
  name: "Login",
  setup() {
    const store = useStore();

    const schema = yup.object({
      email: yup.string().required().email().nullable().label("Email"),
      password: yup.string().required().nullable().label("Password")
    });

    const { handleSubmit, errors, values, submitCount } = useForm({
      validationSchema: schema
    });

    const router = useRouter();

    const state = reactive({
      loading: false
    });

    const onSubmit = handleSubmit(async () => {
      try {
        state.loading = true;
        const data = await firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password);
        const userDetails = await UserService.getDetails(data.user.uid);
        await store.dispatch("user/fetchUser", { id: data.user.uid, ...userDetails });
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
    });

    return {
      onSubmit,
      values,
      submitCount,
      errors,
      registerRoute: ROUTE_NAMES.REGISTER
    };
  }
});
</script>
<style lang="scss" scoped>
.login-card {
  width: 700px;
}
</style>
