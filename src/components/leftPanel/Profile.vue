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
      <img src="../../assets/me.jpg" />
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
      :model-value="`${state.user.data.username}#${state.user.data.shorthandId}`"
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
  <input type="file" hidden @change="onChange" ref="filePicker" accept=".pdf,.jpg,.jpeg,.png" />
  <avatar-editor-dialog v-model="state.avatarEditorDialog" />
</template>

<script>
import { defineComponent, reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import UserService from "src/services/users";
import AvatarEditorDialog from "../avatarEditor/AvatarEditorDialog.vue";

export default defineComponent({
  name: "profile",
  emits: ["set-left-panel"],
  components: {
    AvatarEditorDialog
  },
  setup() {
    const store = useStore();
    const filePicker = ref(null);

    const state = reactive({
      user: computed(() => store.getters["user/user"]),
      avatarEditorDialog: false
    });

    const uploadProfilePicture = () => {
      state.avatarEditorDialog = true;
      // filePicker.value.click();
    };

    const onChange = async () => {
      const file = filePicker.value.files[0];
      const pictureUrl = await UserService.uploadProfilePicture(file);
      console.log(pictureUrl);
    };

    return {
      state,
      uploadProfilePicture,
      filePicker,
      onChange
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
