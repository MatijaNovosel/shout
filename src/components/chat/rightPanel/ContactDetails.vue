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
      label-color="teal"
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
      label-color="teal"
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

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "contact-details",
  emits: ["close"],
  props: {
    contactDetails: {
      type: Object,
      required: true
    }
  },
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
.bg {
  background-color: #131c21 !important;
}

.back-button-container {
  background-color: #323739;
  height: 58px;
}
</style>
