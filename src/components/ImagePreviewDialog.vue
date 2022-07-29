<template>
  <q-dialog :model-value="modelValue" @hide="$emit('update:modelValue', false)">
    <q-card dark class="image-preview-dialog">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>
            {{ $t("close") }}
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="row justify-center">
        <img class="image" :src="src" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean
  },
  src: {
    type: String
  }
});

const emit = defineEmits(["update:modelValue"]);

const close = () => {
  emit("update:modelValue", false);
};
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
