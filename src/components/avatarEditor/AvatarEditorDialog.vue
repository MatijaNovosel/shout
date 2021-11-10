<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card dark class="new-chat-dialog">
      <q-bar>
        <span> Edit avatar </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="column items-center justify-center">
        <avatar-editor
          :width="400"
          :height="400"
          ref="avatarEditor"
          image="https://cdn.quasar.dev/img/avatar.png"
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
        <q-btn color="teal" @click="saveClicked"> Save </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onUnmounted } from "vue";
import AvatarEditor from "src/components/avatarEditor/AvatarEditor.vue";
import AvatarEditorScale from "src/components/avatarEditor/AvatarEditorScale.vue";

export default defineComponent({
  name: "avatar-editor-dialog",
  components: {
    AvatarEditor,
    AvatarEditorScale
  },
  props: {
    modelValue: {
      type: Boolean
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
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

    const saveClicked = () => {
      const img = avatarEditor.value.getImageScaled();
      console.log(img);
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

    return {
      state,
      close,
      avatarEditor,
      saveClicked,
      onImageReady
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.new-chat-dialog {
  width: 600px;
}
</style>
