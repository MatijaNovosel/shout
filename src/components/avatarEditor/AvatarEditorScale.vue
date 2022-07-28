<template>
  <input
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :style="{ width: `${width}px` }"
    v-model="state.scale"
  />
</template>

<script setup>
import { reactive, watch } from "vue";

const emit = defineEmits(["update:scale"]);

const props = defineProps({
  width: {
    type: Number,
    default: 200
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 2
  },
  step: {
    type: Number,
    default: 0.01
  },
  scale: {
    type: Number,
    required: true
  }
});

const state = reactive({
  scale: props.scale
});

watch(
  () => props.scale,
  (val) => {
    state.scale = val;
  }
);

watch(
  () => state.scale,
  (val) => {
    emit("update:scale", parseFloat(val));
  }
);
</script>
