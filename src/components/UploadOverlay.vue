<template>
  <div class="overlay-container" @dragover="dragover" @drop="drop">
    <div class="full-width overlay-indicator" v-show="state.draggingOver" @dragleave="dragleave">
      <h2 class="pointer-events-none text-grey text-h6 overlay-indicator-text">Drag file here</h2>
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
  setup() {
    const filePicker = ref(null);

    const state = reactive({
      filelist: [],
      draggingOver: false
    });

    const onChange = () => {
      state.filelist = [...filePicker.value.files];
      console.log(state.filelist);
    };

    const dragover = (e) => {
      state.draggingOver = true;
      e.preventDefault();
    };

    const dragleave = (e) => {
      console.log("btuh");
      state.draggingOver = false;
      e.preventDefault();
    };

    const drop = (e) => {
      e.preventDefault();
      filePicker.value.files = e.dataTransfer.files;
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

.overlay-indicator-text {
  border: 2px dotted grey;
  padding: 33%;
}
</style>
