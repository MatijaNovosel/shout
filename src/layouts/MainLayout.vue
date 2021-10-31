<template>
  <q-layout class="bg">
    <q-page-container>
      <router-view> </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout"
});
</script>

<style scoped lang="scss">
.bg {
  background-color: #090e11;
}
</style>
