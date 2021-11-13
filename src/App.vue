<template>
  <router-view></router-view>
</template>

<script>
import { defineComponent } from "vue";
import firebase from "firebase";
import { useStore } from "vuex";
import UserService from "src/services/users";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();

    firebase.auth().onAuthStateChanged(async (auth) => {
      if (auth) {
        const userDetails = await UserService.getDetails(auth.uid);
        await store.dispatch("user/fetchUser", { id: auth.uid, ...userDetails });
      }
    });

    return {};
  }
});
</script>
