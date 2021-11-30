<template>
  <div class="column items-center full-height bg" v-if="user">
    <div class="self-start row items-center q-pa-md back-button-container full-width">
      <q-btn
        @click="$emit('set-left-panel', 'conversations')"
        color="grey"
        icon="mdi-arrow-left"
        round
        flat
      />
      <span class="text-white text-h6 q-ml-sm">
        {{ $t("profile") }}
      </span>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <q-spinner size="md" color="orange" v-if="state.uploadingPfp" />
      <img :src="user.avatarUrl" v-else />
      <q-btn
        padding="sm"
        color="orange"
        icon="mdi-pencil"
        fab
        class="change-pfp-btn"
        @click="openAvatarEditorDialog"
      />
    </q-avatar>
    <q-input
      dark
      :label="$t('username')"
      :model-value="`${user.username}#${user.shorthandId}`"
      label-color="orange"
      class="full-width q-px-lg"
      readonly
    />
    <q-input
      dark
      label="Status"
      autogrow
      model-value="I will not go, prefer a feast of friends to the giant family"
      label-color="orange"
      class="full-width q-px-lg q-mt-md"
      readonly
    />
  </div>
  <avatar-editor-dialog
    @save="uploadPfp"
    v-model="state.avatarEditorDialog"
    :initial-image="user.avatarUrl"
  />
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import { useStore } from "vuex";
import AvatarEditorDialog from "../avatarEditor/AvatarEditorDialog.vue";
import UserService from "src/services/users";
import { Notify } from "quasar";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "profile",
  emits: ["set-left-panel"],
  components: {
    AvatarEditorDialog
  },
  setup() {
    const store = useStore();
    const { t } = useI18n({ useScope: "global" });

    const state = reactive({
      avatarEditorDialog: false,
      uploadingPfp: false
    });

    const openAvatarEditorDialog = () => {
      state.avatarEditorDialog = true;
    };

    const uploadPfp = async (imgFile) => {
      try {
        state.uploadingPfp = true;
        const url = await UserService.uploadProfilePicture(imgFile, store.getters["user/user"].id);
        const userDetails = { ...store.getters["user/user"] };
        userDetails.avatarUrl = url;
        await store.dispatch("user/fetchUser", userDetails);
        Notify.create({
          message: t("successfullyChangedProfilePicture"),
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: t("failedToUpdateProfilePicture"),
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } finally {
        state.uploadingPfp = false;
      }
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
