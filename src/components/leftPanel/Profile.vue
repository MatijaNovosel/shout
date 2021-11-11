<template>
  <div class="column items-center full-height bg">
    <div class="self-start row items-center q-pa-md back-button-container full-width">
      <q-btn
        @click="$emit('set-left-panel', 'conversations')"
        color="grey"
        icon="mdi-arrow-left"
        round
        flat
      />
      <span class="text-white text-h6 q-ml-sm"> Profile </span>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <img :src="user.avatarUrl" />
      <q-btn
        padding="sm"
        color="teal"
        icon="mdi-pencil"
        fab
        class="change-pfp-btn"
        @click="openAvatarEditorDialog"
      />
    </q-avatar>
    <q-input
      dark
      label="Username"
      :model-value="`${user.username}#${user.shorthandId}`"
      label-color="teal"
      class="full-width q-px-lg"
      readonly
    />
    <q-input
      dark
      label="Status"
      autogrow
      model-value="I will not go, prefer a feast of friends to the giant family"
      label-color="teal"
      class="full-width q-px-lg q-mt-md"
      readonly
    />
  </div>
  <avatar-editor-dialog @save="uploadPfp" v-model="state.avatarEditorDialog" />
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import { useStore } from "vuex";
import AvatarEditorDialog from "../avatarEditor/AvatarEditorDialog.vue";
import UserService from "src/services/users";

export default defineComponent({
  name: "profile",
  emits: ["set-left-panel"],
  components: {
    AvatarEditorDialog
  },
  setup() {
    const store = useStore();

    const state = reactive({
      avatarEditorDialog: false
    });

    const openAvatarEditorDialog = () => {
      state.avatarEditorDialog = true;
    };

    const uploadPfp = async (imgFile) => {
      await UserService.uploadProfilePicture(imgFile);
    };

    return {
      state,
      openAvatarEditorDialog,
      uploadPfp,
      user: computed(() => store.getters["user/user"])
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.bg {
  background-color: $bg-dark-2 !important;
}

.back-button-container {
  background-color: $bg-dark-1;
}

.change-pfp-btn {
  top: 10px;
  right: 10px;
  position: absolute;
}
</style>
