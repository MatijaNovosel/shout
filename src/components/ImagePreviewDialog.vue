<template>
  <q-dialog :model-value="modelValue" @hide="$emit('update:modelValue', false)">
    <q-card dark class="image-preview-dialog">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="row justify-center">
        <img class="image" :src="src" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "image-preview-dialog",
  props: {
    modelValue: {
      type: Boolean
    },
    src: {
      type: String
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const state = reactive({});

    const close = () => {
      emit("update:modelValue", false);
    };

    return {
      state,
      close
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.image-preview-dialog {
  width: 600px;
}

.image {
  max-width: 500px;
  max-height: 500px;
}
</style>
