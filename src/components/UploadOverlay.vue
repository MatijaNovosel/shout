<template>
  <div class="overlay-container" @dragover="dragover" @drop="drop">
    <div class="full-width overlay-indicator" v-show="state.draggingOver" @dragleave="dragleave">
      <h2 class="pointer-events-none text-grey text-h6">Drag file here</h2>
    </div>
    <input
      type="file"
      multiple
      hidden
      @change="onChange"
      ref="filePicker"
      accept=".pdf,.jpg,.jpeg,.png"
    />
    <slot />
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  name: "upload-overlay",
  emits: ["change"],
  setup(props, { emit }) {
    const filePicker = ref(null);

    const state = reactive({
      filelist: [],
      draggingOver: false
    });

    const onChange = () => {
      emit("change", filePicker.value.files);
    };

    const dragover = (e) => {
      state.draggingOver = true;
      e.preventDefault();
    };

    const dragleave = (e) => {
      state.draggingOver = false;
      e.preventDefault();
    };

    const drop = (e) => {
      e.preventDefault();
      filePicker.value.files = e.dataTransfer.files;
      state.draggingOver = false;
      onChange();
    };

    return {
      dragover,
      dragleave,
      drop,
      filePicker,
      onChange,
      state
    };
  }
});
</script>

<style lang="scss" scoped>
@import "src/utils/variables";

.overlay-container {
  display: contents;
}

.overlay-indicator {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background-color: $bg-dark-1;
  height: calc(100% - 56px);
  top: 56px;
}

.pointer-events-none {
  pointer-events: none;
}
</style>
