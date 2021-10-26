<template>
  <div class="add-file-container">Hello</div>
</template>

<script>
import { defineComponent, reactive, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "add-file-panel",
  emits: ["close"],
  props: {
    files: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const state = reactive({});

    const escape = (e) => {
      if (e.keyCode === 27) {
        emit("close");
      }
    };

    onMounted(() => {
      document.addEventListener("keyup", escape);
    });

    onUnmounted(() => {
      document.removeEventListener("keyup", escape);
    });

    return {
      state
    };
  }
});
</script>

<style lang="scss" scoped>
@import "src/utils/variables.scss";

.add-file-container {
  position: relative;
  max-height: calc(100% - 118px);
  height: calc(100% - 118px);
  background-color: $bg-dark-2;
}
</style>
