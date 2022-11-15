<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card dark class="new-chat-dialog">
      <q-bar>
        <span> {{ $t("editAvatar") }} </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>
            {{ $t("close") }}
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="column items-center justify-center">
        <avatar-editor
          :width="400"
          :height="400"
          ref="avatarEditor"
          :image="initialImage"
          @image-ready="onImageReady"
          v-model:scale="state.avatarEditorScale"
        />
        <br />
        <avatar-editor-scale
          :width="250"
          :min="state.scaleMin"
          :max="state.scaleMax"
          :step="state.scaleStep"
          v-model:scale="state.avatarEditorScale"
        />
        <br />
        <q-btn color="orange" @click="save">
          {{ $t("save") }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import AvatarEditor from "src/components/avatarEditor/AvatarEditor.vue";
import AvatarEditorScale from "src/components/avatarEditor/AvatarEditorScale.vue";
import { dataURLtoFile } from "src/utils/helpers";
import { useStore } from "vuex";

defineProps({
  modelValue: {
    type: Boolean
  },
  initialImage: {
    type: String
  }
});

const emit = defineEmits(["update:modelValue", "save"]);
const store = useStore();

const state = reactive({
  avatarEditorScale: 1,
  scaleMin: 1,
  scaleMax: 3,
  scaleStep: 0.02
});

const avatarEditor = ref(null);

const close = () => {
  emit("update:modelValue", false);
};

const save = () => {
  const canvasData = avatarEditor.value.getImageScaled();
  const img = canvasData.toDataURL("image/png");
  const imgFile = dataURLtoFile(img, "savedImg.png");
  emit("save", imgFile);
  close();
};

const onImageReady = (scale) => {
  state.avatarEditorScale = parseFloat(scale);
};

const handleWheelEvent = (e) => {
  if (e.deltaY > 0) {
    // Down
    if (state.avatarEditorScale - state.scaleStep >= state.scaleMin) {
      state.avatarEditorScale -= state.scaleStep;
    }
  } else {
    // Up
    if (state.avatarEditorScale + state.scaleStep <= state.scaleMax) {
      state.avatarEditorScale += state.scaleStep;
    }
  }
};

onMounted(() => {
  document.addEventListener("wheel", handleWheelEvent);
});

onUnmounted(() => {
  document.removeEventListener("wheel", handleWheelEvent);
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.new-chat-dialog {
  width: 600px;
}
</style>
