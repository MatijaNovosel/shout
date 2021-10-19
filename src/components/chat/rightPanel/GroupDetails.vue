<template>
  <div class="column items-center full-height bg">
    <div class="self-start row items-center q-pl-sm back-button-container full-width">
      <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
      <span class="text-white q-ml-sm"> Group details </span>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <img src="../../../assets/gopniks.jpg" />
    </q-avatar>
    <q-input
      dark
      label="Group name"
      model-value="Group chat"
      label-color="teal"
      class="full-width q-px-lg"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <span class="text-grey self-start q-pl-lg q-mt-sm">
      {{ `Created ${format(new Date(), "dd/MM/yyyy' at 'HH:mm")}` }}
    </span>
    <q-input
      dark
      label="Description"
      autogrow
      model-value="Add group description"
      label-color="teal"
      class="full-width q-px-lg q-mt-md"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { format } from "date-fns";

export default defineComponent({
  name: "group-details",
  emits: ["close"],
  setup() {
    const state = reactive({});

    return {
      state,
      format
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
