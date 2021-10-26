<template>
  <div class="column items-center full-height bg">
    <div
      class="self-start justify-between row items-center q-pl-sm back-button-container full-width"
    >
      <div>
        <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
        <span class="text-white q-ml-sm"> Search messages </span>
      </div>
    </div>
    <q-input dark label="Group name" label-color="teal" class="full-width q-px-lg" readonly>
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "private-chat-search",
  emits: ["close"],
  setup() {
    const state = reactive({
      muteNotifications: false
    });

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
  height: 58px;
}
</style>
