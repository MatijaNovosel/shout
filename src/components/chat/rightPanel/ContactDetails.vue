<template>
  <div class="column items-center full-height bg">
    <div
      class="self-start justify-between row items-center q-pl-sm back-button-container full-width"
    >
      <div>
        <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
        <span class="text-white q-ml-sm"> Group details </span>
      </div>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <img src="../../../assets/gopniks.jpg" />
    </q-avatar>
    <q-input
      dark
      label="Username"
      :model-value="contactDetails.name"
      label-color="orange"
      class="full-width q-px-lg"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <q-input
      dark
      label="Status"
      :model-value="contactDetails.status"
      label-color="orange"
      class="full-width q-px-lg q-mt-md"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <div class="column self-start q-pl-sm full-width">
      <q-list dark>
        <q-item>
          <q-item-section> Mute notifications </q-item-section>
          <q-item-section side>
            <q-checkbox dark v-model="state.muteNotifications" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const emit = defineEmits(["close"]);

defineProps({
  contactDetails: {
    type: Object,
    required: true
  }
});

const state = reactive({
  muteNotifications: false
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
