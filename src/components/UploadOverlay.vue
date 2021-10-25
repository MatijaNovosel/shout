<template>
  <div class="overlay-container" @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <div class="full-height full-width overlay-indicator bg-grey" v-show="state.draggingOver">
      <img src="../assets/plenkovic.jpg" />
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
      // Add some visual fluff to show the user can drop its files here
    };

    const dragleave = (e) => {
      state.draggingOver = false;
      // Clean up
    };

    const drop = (e) => {
      e.preventDefault();
      filePicker.value.files = e.dataTransfer.files;
      onChange();
      // Clean up
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
.overlay-container {
  display: contents;
}

.overlay-indicator {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
