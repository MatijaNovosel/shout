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
          :image="state.userAvatar"
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
        <q-btn color="teal" @click="save"> Save </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onUnmounted, computed } from "vue";
import AvatarEditor from "src/components/avatarEditor/AvatarEditor.vue";
import AvatarEditorScale from "src/components/avatarEditor/AvatarEditorScale.vue";
import { dataURLtoFile } from "src/utils/helpers";
import UserService from "src/services/users";
import { useStore } from "vuex";

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
    const store = useStore();

    const state = reactive({
      avatarEditorScale: 1,
      scaleMin: 1,
      scaleMax: 3,
      scaleStep: 0.02,
      userAvatar: computed(() => store.getters["user/user"].avatarUrl)
    });

    const avatarEditor = ref(null);

    const close = () => {
      emit("update:modelValue", false);
    };

    const save = () => {
      const canvasData = avatarEditor.value.getImageScaled();
      const img = canvasData.toDataURL("image/png");
      const imgFile = dataURLtoFile(img, "savedImg.png");
      UserService.uploadProfilePicture(imgFile);
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

    return {
      state,
      close,
      avatarEditor,
      save,
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
