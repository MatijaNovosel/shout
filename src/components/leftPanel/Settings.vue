<template>
  <div class="column full-height bg">
    <div class="self-start row items-center q-pa-md back-button-container full-width">
      <q-btn
        @click="$emit('set-left-panel', 'conversations')"
        color="grey"
        icon="mdi-arrow-left"
        round
        flat
      />
      <span class="text-white text-h6 q-ml-sm"> Settings </span>
    </div>
    <div class="row items-center align-center q-ml-lg">
      <q-avatar size="70px" class="q-my-md">
        <img src="../../assets/me.jpg" />
      </q-avatar>
      <div class="column q-ml-md">
        <span class="text-grey"> Matija Novosel </span>
        <span class="text-grey-4"> Some text </span>
      </div>
    </div>
    <q-list dark>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-circle" />
        </q-item-section>
        <q-item-section>Theme</q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-bell" />
        </q-item-section>
        <q-item-section>Notifications</q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-text-box" />
        </q-item-section>
        <q-item-section>Chat wallpaper</q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-close-circle" />
        </q-item-section>
        <q-item-section>Blocked</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "settings",
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
