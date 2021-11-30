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
      <span class="text-white text-h6 q-ml-sm"> {{ $t("settings") }} </span>
    </div>
    <q-list dark>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-circle" />
        </q-item-section>
        <q-item-section>
          {{ $t("theme") }}
        </q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-text-box" />
        </q-item-section>
        <q-item-section>
          {{ $t("chatWallpaper") }}
        </q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-close-circle" />
        </q-item-section>
        <q-item-section>
          {{ $t("blocked") }}
        </q-item-section>
      </q-item>
      <q-separator dark />
      <q-item clickable v-close-popup @click="state.languageSelectDialog = true">
        <q-item-section avatar>
          <q-icon color="grey" size="xs" name="mdi-flag" />
        </q-item-section>
        <q-item-section>
          {{ $t("language") }}
        </q-item-section>
      </q-item>
    </q-list>
    <language-select-dialog v-model="state.languageSelectDialog" />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import LanguageSelectDialog from "../LanguageSelectDialog.vue";

export default defineComponent({
  name: "settings",
  emits: ["set-left-panel"],
  components: {
    LanguageSelectDialog
  },
  setup() {
    const state = reactive({
      languageSelectDialog: false
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
}
</style>
