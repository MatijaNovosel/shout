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
      <q-card-section>
        <avatar-editor
          :width="400"
          :height="400"
          :set-scale-trigger="state.avatarEditorScaleVal"
          ref="avatarEditor"
          @image-ready="onImageReady"
          image="https://cdn.quasar.dev/img/avatar.png"
        />
        <br />
        <avatar-editor-scale
          :set-scale-trigger="state.avatarEditorScale"
          @change-scale="onChangeScale"
          :width="250"
          :min="1"
          :max="3"
          :step="0.02"
        />
        <br />
        <button @click="saveClicked">Save</button>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref, provide } from "vue";
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
      avatarEditorScale: 0,
      avatarEditorScaleVal: 0
    });
    const avatarEditor = ref(null);

    const close = () => {
      emit("update:modelValue", false);
    };

    const onChangeScale = (scale) => {
      state.avatarEditorScaleVal = parseFloat(scale);
    };

    const saveClicked = () => {
      const img = avatarEditor.value.getImageScaled();
      console.log(img);
    };

    const onImageReady = (scale) => {
      state.avatarEditorScale = parseFloat(scale);
    };

    return {
      state,
      close,
      avatarEditor,
      saveClicked,
      onChangeScale,
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
