<template>
  <div class="column items-center full-height bg">
    <div
      class="self-start justify-between row items-center q-pl-sm back-button-container full-width"
    >
      <div>
        <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
        <span class="text-white q-ml-sm"> Group details </span>
      </div>
      <div class="q-mr-md">
        <q-btn flat round color="red-5" icon="mdi-exit-to-app" />
      </div>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <q-spinner size="md" color="teal" v-if="uploadingPfp" />
      <img :src="groupDetails.avatar" v-else />
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
      label="Group name"
      :model-value="groupDetails.name"
      label-color="teal"
      class="full-width q-px-lg"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <span class="text-grey self-start q-mt-sm q-ml-lg"> Created {{ groupDetails.createdAt }} </span>
    <q-input
      dark
      label="Description"
      :model-value="groupDetails.description"
      label-color="teal"
      class="full-width q-px-lg q-mt-md"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <div class="column self-start q-pl-sm full-width">
      <q-list dark>
        <q-item>
          <q-item-section> Mute notifications </q-item-section>
          <q-item-section side>
            <q-checkbox dark v-model="state.muteNotifications" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="column self-start q-px-sm full-width q-mt-sm">
      <div class="row text-teal justify-between q-pl-md">
        <span> {{ groupDetails.users.length }} users </span>
        <q-btn color="grey" flat round size="sm" icon="mdi-magnify" />
      </div>
      <q-list dark>
        <q-item clickable v-for="(user, i) in groupDetails.users" :key="i">
          <q-item-section top avatar>
            <q-avatar>
              <img :src="user.avatarUrl" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ user.username }}
            </q-item-label>
            <q-item-label caption class="text-grey">
              {{ user.about }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "group-details",
  emits: ["close", "open-avatar-editor"],
  props: {
    groupDetails: {
      type: Object,
      required: true
    },
    uploadingPfp: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    const store = useStore();

    const state = reactive({
      muteNotifications: false,
      avatarEditorDialog: false
    });

    const openAvatarEditorDialog = () => {
      emit("open-avatar-editor");
    };

    return {
      state,
      openAvatarEditorDialog
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
  height: 58px;
}

.change-pfp-btn {
  top: 10px;
  right: 10px;
  position: absolute;
}
</style>
