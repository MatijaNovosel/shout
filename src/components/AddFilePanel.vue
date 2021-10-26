<template>
  <div class="add-file-container column items-center">
    <div class="self-start justify-between row items-center q-px-md top-bar full-width">
      <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
      <span class="text-white q-ml-sm">
        {{ state.selectedFile !== null ? state.selectedFile.name : "No files found" }}
      </span>
      <q-btn size="sm" color="grey" icon="mdi-send" round flat />
    </div>
    <div class="column">
      <div class="col-12 q-pt-lg row">
        <div
          class="file-preview-item q-mr-md"
          v-for="(file, i) in state.files"
          :key="i"
          :class="{
            'active-file-item': state.selectedFile.name === file.name
          }"
        >
          <q-btn
            @click="removeFile(file)"
            class="top-right-remove-btn"
            size="xs"
            color="grey"
            icon="mdi-close"
            round
            flat
          />
          <q-icon
            class="cursor-pointer"
            @click="setActiveFile(file)"
            color="white"
            size="40px"
            :name="getFileIcon(file.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, onUnmounted, watch } from "vue";
import { getFileIcon } from "src/utils/helpers";

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
    const state = reactive({
      selectedFile: null,
      files: []
    });

    const escape = (e) => {
      if (e.keyCode === 27) {
        emit("close");
      }
    };

    const removeFile = (file) => {
      const foundFileIndex = state.files.findIndex((f) => f.name === file.name);

      if (state.files.length === 1) {
        state.selectedFile = null;
        state.files.splice(foundFileIndex, 1);
        emit("close");
      } else {
        if (state.selectedFile.name === file.name) {
          if (foundFileIndex - 1 in state.files) {
            state.files.splice(foundFileIndex, 1);
            state.selectedFile = state.files[foundFileIndex - 1];
          } else {
            state.files.splice(foundFileIndex, 1);
            state.selectedFile = state.files[foundFileIndex + 1];
          }
        } else {
          state.files.splice(foundFileIndex, 1);
        }
      }
    };

    const setActiveFile = (file) => {
      if (state.selectedFile.name !== file.name) {
        state.selectedFile = file;
      }
    };

    onMounted(() => {
      document.addEventListener("keyup", escape);
    });

    onUnmounted(() => {
      document.removeEventListener("keyup", escape);
    });

    watch(
      () => props.files,
      (val) => {
        state.files = [...val];
        if (state.files.length !== 0) {
          state.selectedFile = state.files[0];
        }
      },
      {
        immediate: true
      }
    );

    return {
      state,
      getFileIcon,
      removeFile,
      setActiveFile
    };
  }
});
</script>

<style lang="scss" scoped>
@import "src/utils/variables.scss";

.add-file-container {
  position: relative;
  max-height: calc(100% - 58px);
  height: calc(100% - 58px);
  background-color: $bg-dark-2;
}

.top-bar {
  background-color: $bg-dark-1;
  height: 58px;
}

.file-preview-item {
  background-color: $bg-dark-3;
  padding: 1em;
  border-radius: 8px;
  position: relative;
}

.active-file-item {
  background-color: $bg-dark-4;
}

.top-right-remove-btn {
  top: 2px;
  right: 2px;
  position: absolute;
}
</style>
