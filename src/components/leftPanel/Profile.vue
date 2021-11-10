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
      <img :src="state.avatarUrl" />
      <q-btn
        padding="sm"
        color="teal"
        icon="mdi-pencil"
        fab
        class="change-pfp-btn"
        @click="uploadProfilePicture"
      />
    </q-avatar>
    <q-input
      dark
      label="Username"
      :model-value="`${state.user.username}#${state.user.shorthandId}`"
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
  <avatar-editor-dialog v-model="state.avatarEditorDialog" />
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import { useStore } from "vuex";
import AvatarEditorDialog from "../avatarEditor/AvatarEditorDialog.vue";

export default defineComponent({
  name: "profile",
  emits: ["set-left-panel"],
  components: {
    AvatarEditorDialog
  },
  setup() {
    const store = useStore();

    const state = reactive({
      user: computed(() => store.getters["user/user"]),
      avatarUrl: computed(() => store.getters["user/user"].avatarUrl),
      avatarEditorDialog: false
    });

    const uploadProfilePicture = () => {
      state.avatarEditorDialog = true;
    };

    return {
      state,
      uploadProfilePicture
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
