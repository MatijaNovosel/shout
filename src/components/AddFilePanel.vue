<template>
  <div class="add-file-container column items-center">
    <div class="self-start justify-between row items-center q-px-md top-bar full-width">
      <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="close" />
      <span class="text-white q-ml-sm">
        {{ state.selectedFile !== null ? state.selectedFile.name : "No files found" }}
      </span>
      <q-btn size="sm" color="grey" icon="mdi-send" round flat />
    </div>
    <div
      class="row justify-center items-center align-center text-center"
      v-if="state.selectedFile !== null"
    >
      <div
        class="col-12 q-pt-lg row justify-center items-center align-center text-grey text-center"
      >
        <img
          class="preview-box"
          :src="state.selectedFile.image"
          v-if="['jpg', 'png', 'jpeg', 'gif'].includes(getFileExtension(state.selectedFile.name))"
        />
        <div
          class="
            preview-box-bg
            column
            justify-center
            items-center
            align-center
            text-grey text-center
          "
          v-else
        >
          <q-icon size="60px" name="mdi-file" />
          <span class="q-pt-sm"> No preview available. </span>
        </div>
      </div>
      <div class="col-12 q-pt-lg row justify-center items-center">
        <div
          class="file-preview-item q-mr-md row justify-center items-center align-center"
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
          <span class="text-bold text-grey q-mt-xs">
            {{ getFileExtension(file.name).toUpperCase() }}
          </span>
        </div>
        <div
          class="
            file-preview-item
            q-mr-md
            row
            justify-center
            items-center
            align-center
            cursor-pointer
          "
          @click="triggerFilePickerManually"
        >
          <q-icon color="teal" size="40px" name="mdi-plus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, onUnmounted, watch, ref } from "vue";
import { getFileIcon, getFileExtension, readUrl } from "src/utils/helpers";

export default defineComponent({
  name: "add-file-panel",
  emits: ["close", "trigger-file-picker"],
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

    const close = () => {
      state.files = [];
      emit("close");
    };

    const escape = (e) => {
      if (e.keyCode === 27) {
        close();
      }
    };

    const removeFile = (file) => {
      const foundFileIndex = state.files.findIndex((f) => f.name === file.name);

      if (state.files.length === 1) {
        state.selectedFile = null;
        state.files.splice(foundFileIndex, 1);
        close();
      } else {
        if (state.selectedFile.name === file.name) {
          if (foundFileIndex - 1 in state.files) {
            state.selectedFile = state.files[foundFileIndex - 1];
            state.files.splice(foundFileIndex, 1);
          } else {
            state.selectedFile = state.files[foundFileIndex + 1];
            state.files.splice(foundFileIndex, 1);
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

    const triggerFilePickerManually = () => {
      emit("trigger-file-picker");
    };

    onMounted(() => {
      document.addEventListener("keyup", escape);
    });

    onUnmounted(() => {
      document.removeEventListener("keyup", escape);
    });

    watch(
      () => props.files,
      async (val) => {
        const files = [...val];
        if (files.length !== 0) {
          for (let i = 0; i < files.length; i++) {
            const url = await readUrl(files[i]);
            files[i].image = url;
            state.files.push(files[i]);
          }
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
      setActiveFile,
      getFileExtension,
      close,
      triggerFilePickerManually
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
  width: 90px;
  height: 90px;
}

.active-file-item {
  background-color: $bg-dark-4;
}

.top-right-remove-btn {
  top: 2px;
  right: 2px;
  position: absolute;
}

.preview-box {
  height: 300px;
  width: 300px;
  border-radius: 10px;
}

.preview-box-bg {
  @extend .preview-box;
  background-color: $bg-dark-3;
}
</style>
