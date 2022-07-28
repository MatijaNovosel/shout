<template>
  <div class="overlay-container" @dragover="dragover" @drop="drop">
    <div class="full-width overlay-indicator" v-show="state.draggingOver" @dragleave="dragleave">
      <h2 class="pointer-events-none text-grey text-h6">
        {{ $t("dragFileHere") }}
      </h2>
    </div>
    <input type="file" multiple hidden @change="onChange" ref="filePicker" />
    <slot />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, inject } from "vue";
import { MIME_TYPES } from "src/utils/constants";
import { getFileExtension } from "src/utils/helpers";
import { Notify } from "quasar";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["change"]);
const filePicker = ref(null);
const { t } = useI18n();

// Plugins
const filePickerTrigger = inject("filePickerTrigger");

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
      message: t("thatFileExtensionIsNotAllowed"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
    return;
  }

  if ([...e.dataTransfer.files].length > 5) {
    Notify.create({
      message: t("max5Files"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
    return;
  }

  // Under 2MB
  if ([...e.dataTransfer.files].some((f) => f.size >= 3145728)) {
    Notify.create({
      message: t("maxUploadSize"),
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
  () => filePickerTrigger.value,
  () => {
    filePicker.value.click();
  }
);
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
