<template>
  <div class="add-file-container column items-center">
    <div class="self-start justify-between row items-center q-px-md top-bar full-width">
      <q-btn color="grey" icon="mdi-close" round flat @click="close" />
      <span class="text-white q-ml-sm">
        {{ state.selectedFile !== null ? state.selectedFile.name : "No files found" }}
      </span>
      <q-btn color="grey" icon="mdi-send" round flat @click="sendFiles">
        <q-badge floating v-if="state.files.length > 1">
          {{ state.files.length }}
        </q-badge>
      </q-btn>
    </div>
    <div
      class="row justify-center items-center align-center text-center"
      v-if="state.selectedFile !== null"
    >
      <div
        class="col-12 q-pt-lg row justify-center items-center align-center text-grey text-center"
      >
        <img
          :src="state.selectedFile.urlContent"
          class="preview-box"
          v-if="fileIsType(state.selectedFile.name, [GENERALIZED_FILE_TYPES.IMAGE])"
        />
        <video
          v-else-if="fileIsType(state.selectedFile.name, [GENERALIZED_FILE_TYPES.VIDEO])"
          :style="{
            borderRadius: '8px'
          }"
          :width="state.selectedFile.portrait ? 300 : 500"
          :height="state.selectedFile.portrait ? 500 : 300"
          controls
        >
          <source :src="state.selectedFile.urlContent" type="video/mp4" />
          {{ $t("yourBrowserDoesNotSupportTheVideoTag") }}.
        </video>
        <audio
          controls
          v-else-if="fileIsType(state.selectedFile.name, [GENERALIZED_FILE_TYPES.AUDIO])"
        >
          <source :src="state.selectedFile.urlContent" type="audio/webm" />
          {{ $t("yourBrowserDoesNotSupportTheAudioElement") }}.
        </audio>
        <div
          class="preview-box-bg column justify-center items-center align-center text-grey text-center"
          v-else
        >
          <q-icon size="60px" name="mdi-file" />
          <span class="q-pt-sm"> {{ $t("noPreviewAvailable") }}. </span>
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
            class="cursor-pointer col-12"
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
          class="file-preview-item q-mr-md row justify-center items-center align-center cursor-pointer"
          @click="triggerFilePickerManually"
        >
          <q-icon color="orange" size="40px" name="mdi-plus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, watch } from "vue";
import {
  getFileIcon,
  getFileExtension,
  readUrl,
  imageSize,
  videoSize,
  fileIsType
} from "src/utils/helpers";
import { GENERALIZED_FILE_TYPES } from "src/utils/constants";

const emit = defineEmits(["close", "trigger-file-picker", "send-files"]);
const props = defineProps({
  files: {
    type: Object,
    required: true
  }
});

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

const sendFiles = () => {
  emit("send-files");
  close();
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
        const isImg = fileIsType(files[i].name, [GENERALIZED_FILE_TYPES.IMAGE]);
        const isVideo = fileIsType(files[i].name, [GENERALIZED_FILE_TYPES.VIDEO]);
        const isAudio = fileIsType(files[i].name, [GENERALIZED_FILE_TYPES.AUDIO]);

        if (isImg || isVideo || isAudio) {
          let dimensions = {};
          const url = await readUrl(files[i]);

          if (isImg) {
            dimensions = await imageSize(url);
          } else {
            dimensions = await videoSize(url);
          }

          if (dimensions.width > dimensions.height) {
            files[i].portrait = false;
          } else {
            files[i].portrait = true;
          }

          files[i].urlContent = url;
        }
        state.files.push(files[i]);
      }
      state.selectedFile = state.files[0];
    }
  },
  {
    immediate: true
  }
);
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
  height: auto;
  width: auto;
  max-height: 500px;
  max-width: 500px;
  border-radius: 10px;
}

.preview-box-bg {
  @extend .preview-box;
  height: 300px;
  width: 300px;
  background-color: $bg-dark-3;
}
</style>
