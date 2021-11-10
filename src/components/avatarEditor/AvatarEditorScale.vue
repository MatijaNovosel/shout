<template>
  <input
    v-model="state.scale"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :style="{ width: `${width}px` }"
  />
</template>

<script>
import { defineComponent, reactive, watch } from "vue";

export default defineComponent({
  name: "avatar-editor-scale",
  emits: ["change-scale"],
  props: {
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
    setScaleTrigger: {
      type: Number
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      scale: 1
    });

    const setScale = (scale) => {
      state.scale = scale;
    };

    watch(
      () => props.setScaleTrigger,
      (val) => {
        setScale(val);
      }
    );

    watch(
      () => state.scale,
      (val) => {
        emit("change-scale", val);
      }
    );

    return {
      state
    };
  }
});
</script>
