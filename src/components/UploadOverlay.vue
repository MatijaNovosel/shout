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
import { defineComponent, reactive, ref, computed, watch } from "vue";
import { MIME_TYPES } from "src/utils/constants";
import { getFileExtension } from "src/utils/helpers";
import { Notify } from "quasar";

export default defineComponent({
  name: "upload-overlay",
  emits: ["change"],
  props: {
    filePickerTrigger: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const filePicker = ref(null);

    const state = reactive({
      filelist: [],
      draggingOver: false,
      allowedExtensions: computed(() => {
        const extensions = [];
        for (const extension in MIME_TYPES) {
          extensions.push(extension);
        }
        return extensions;
      })
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

      state.draggingOver = false;

      if (
        ![...e.dataTransfer.files]
          .map((f) => getFileExtension(f.name).toLowerCase())
          .every((ext) => state.allowedExtensions.includes(ext))
      ) {
        Notify.create({
          message: "That file extension is not allowed!",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
        return;
      }

      if ([...e.dataTransfer.files].length > 5) {
        Notify.create({
          message: "You can upload a maximum of 5 files!",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
        return;
      }

      filePicker.value.files = e.dataTransfer.files;
      onChange();
    };

    watch(
      () => props.filePickerTrigger,
      () => {
        filePicker.value.click();
      }
    );

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
