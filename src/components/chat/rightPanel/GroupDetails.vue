<template>
  <div class="column items-center full-height bg">
    <div class="self-start row items-center q-pa-md back-button-container full-width">
      <q-btn color="grey" icon="mdi-close" round flat @click="$emit('close')" />
      <span class="text-white text-h6 q-ml-sm"> Group details </span>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <img src="../../../assets/me.jpg" />
    </q-avatar>
    <q-input
      dark
      label="Your name"
      model-value="Matija"
      label-color="teal"
      class="full-width q-px-lg"
      readonly
    />
    <q-input
      dark
      label="About"
      autogrow
      model-value="I will not go, prefer a feast of friends to the giant family"
      label-color="teal"
      class="full-width q-px-lg q-mt-md"
      readonly
    />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "group-details",
  emits: ["close"],
  setup() {
    const state = reactive({});

    return {
      state
    };
  }
});
</script>

<style scoped lang="scss">
.bg {
  background-color: #131c21 !important;
}

.back-button-container {
  background-color: #323739;
}
</style>
