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
        <q-btn flat round color="red-5" icon="mdi-exit-to-app" @click="leaveGroup" />
      </div>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <q-spinner size="md" color="orange" v-if="uploadingPfp" />
      <img :src="groupDetails.avatar" v-else />
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
      label="Group name"
      label-color="orange"
      class="full-width q-px-lg"
      :readonly="!state.editingGroupName"
      v-model="state.newGroupName"
    >
      <template #after>
        <div v-if="state.editingGroupName">
          <q-btn color="orange" @click="confirmGroupNameEdit" flat round icon="mdi-check" />
          <q-btn color="red" @click="cancelGroupNameEdit" flat round icon="mdi-close-circle" />
        </div>
        <q-btn v-else @click="startEditingGroupName" color="orange" flat round icon="mdi-pencil" />
      </template>
    </q-input>
    <span class="text-grey self-start q-mt-sm q-ml-lg">
      Created {{ format(groupDetails.createdAt, "dd.MM.yyyy. HH:mm") }}
    </span>
    <q-input
      dark
      label="Description"
      v-model="state.newGroupDescription"
      label-color="orange"
      class="full-width q-px-lg q-mt-md"
      :readonly="!state.editingGroupDescription"
    >
      <template #after>
        <div v-if="state.editingGroupDescription">
          <q-btn color="orange" @click="confirmGroupDescriptionEdit" flat round icon="mdi-check" />
          <q-btn
            color="red"
            @click="cancelGroupDescriptionEdit"
            flat
            round
            icon="mdi-close-circle"
          />
        </div>
        <q-btn
          v-else
          @click="startEditingGroupDescription"
          color="orange"
          flat
          round
          icon="mdi-pencil"
        />
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
      <div class="row text-orange justify-between q-pl-md">
        <span> {{ groupDetails.users.length }} users </span>
        <div>
          <q-btn color="grey" flat round size="sm" icon="mdi-magnify" />
          <q-btn
            color="grey"
            flat
            round
            size="sm"
            icon="mdi-plus"
            @click="state.userSearchDialog = true"
          />
        </div>
      </div>
      <q-list dark>
        <q-item v-for="(user, i) in groupDetails.users" :key="i">
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
          <q-item-section side v-if="userComputed.id !== user.id">
            <q-btn color="grey" flat round icon="mdi-dots-vertical">
              <q-menu dark right :offset="[-15, -5]">
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup @click="removeFromGroup(user)">
                    <q-item-section>Remove member</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openEditPrivilegeDialog(user)">
                    <q-item-section>Edit privileges</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <user-search-dialog
    :users="groupDetails.users.map((u) => `${u.username}#${u.shorthandId}`)"
    v-model="state.userSearchDialog"
    @user-selected="userSelected"
  />
  <edit-privileges-dialog
    :chat-id="groupDetails.id"
    :user-id="state.selectedUserId"
    :privileges="state.userPrivileges"
    v-model="state.editPrivilegesDialog"
  />
</template>

<script>
import { defineComponent, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { format } from "date-fns";
import UserSearchDialog from "src/components/UserSearchDialog.vue";
import EditPrivilegesDialog from "src/components/EditPrivilegesDialog.vue";
import ChatService from "src/services/chats";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "src/router/routeNames";

export default defineComponent({
  name: "group-details",
  emits: ["close", "open-avatar-editor"],
  components: {
    UserSearchDialog,
    EditPrivilegesDialog
  },
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
    const router = useRouter();

    const state = reactive({
      muteNotifications: false,
      avatarEditorDialog: false,
      userSearchDialog: false,
      editPrivilegesDialog: false,
      editingGroupName: false,
      editingGroupDescription: false,
      userPrivileges: [],
      selectedUserId: null,
      newGroupName: null,
      newGroupDescription: null
    });

    const openAvatarEditorDialog = () => {
      emit("open-avatar-editor");
    };

    const userSelected = async (user) => {
      try {
        await ChatService.sendGroupInvite(user.id, props.groupDetails.id, props.groupDetails.name);
        Notify.create({
          message: "Successfully sent the group invite",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: "Failed to send the group invite",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    const removeFromGroup = async (user) => {
      try {
        await ChatService.removeFromGroup(
          store.getters["user/user"].id,
          { id: user.id, username: `${user.username}#${user.shorthandId}` },
          props.groupDetails.id
        );
        Notify.create({
          message: `Successfully removed ${user.username}#${user.shorthandId}`,
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: "Failed to remove user",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    const leaveGroup = async () => {
      try {
        await ChatService.leaveGroup(
          {
            id: store.getters["user/user"].id,
            username: `${store.getters["user/user"].username}#${store.getters["user/user"].shorthandId}`
          },
          props.groupDetails.id
        );
        Notify.create({
          message: "You have left the group",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
        router.push({
          name: ROUTE_NAMES.HOME
        });
      } catch (e) {
        Notify.create({
          message: "Failed to leave group",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    const startEditingGroupName = () => {
      state.editingGroupName = true;
    };

    const cancelGroupNameEdit = () => {
      state.newGroupName = props.groupDetails.name;
      state.editingGroupName = false;
    };

    const openEditPrivilegeDialog = (user) => {
      state.userPrivileges = [...user.privileges];
      state.selectedUserId = user.id;
      state.editPrivilegesDialog = true;
    };

    const confirmGroupNameEdit = async () => {
      state.editingGroupName = false;
      try {
        await ChatService.changeGroupName(state.newGroupName, props.groupDetails.id, store.getters);
        Notify.create({
          message: "Successfully changed group name",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: "Failed to change group name",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    const confirmGroupDescriptionEdit = async () => {
      state.editingGroupDescription = false;
      try {
        await ChatService.changeGroupDescription(
          state.newGroupDescription,
          props.groupDetails.id,
          store.getters
        );
        Notify.create({
          message: "Successfully changed group description",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: "Failed to change group description",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    const cancelGroupDescriptionEdit = () => {
      state.newGroupDescription = props.groupDetails.description;
      state.editingGroupDescription = false;
    };

    const startEditingGroupDescription = () => {
      state.editingGroupDescription = true;
    };

    watch(
      () => props.groupDetails,
      (val) => {
        if (val) {
          state.newGroupName = val.name;
          state.newGroupDescription = val.description;
        }
      },
      {
        deep: true,
        immediate: true
      }
    );

    return {
      state,
      openAvatarEditorDialog,
      format,
      userSelected,
      userComputed: computed(() => store.getters["user/user"]),
      removeFromGroup,
      leaveGroup,
      openEditPrivilegeDialog,
      startEditingGroupName,
      cancelGroupNameEdit,
      confirmGroupNameEdit,
      confirmGroupDescriptionEdit,
      cancelGroupDescriptionEdit,
      startEditingGroupDescription
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
