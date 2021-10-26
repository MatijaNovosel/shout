<template>
  <div class="column items-center full-height bg">
    <div class="self-start row items-center q-pa-md back-button-container full-width">
      <q-btn
        @click="$emit('set-left-panel', 'conversations')"
        color="grey"
        icon="mdi-arrow-left"
        round
        flat
      />
      <span class="text-white text-h6 q-ml-sm"> Profile </span>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <img src="../../assets/me.jpg" />
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
  name: "profile",
  emits: ["set-left-panel"],
  setup() {
    const state = reactive({});

    return {
      state
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.bg {
  background-color: $bg-dark-2 !important;
}

.back-button-container {
  background-color: $bg-dark-1;
}
</style>
