<template>
  <div class="chat-top row justify-between q-py-sm q-px-md">
    <div class="row items-center">
      <template v-if="user">
        <q-avatar class="cursor-pointer" @click="$emit('set-left-panel', 'profile')" size="40px">
          <img :src="user.avatarUrl" />
        </q-avatar>
        <span
          class="q-ml-md text-grey-6 text-weight-bold cursor-pointer"
          @click="copyUsernameToClipboard"
        >
          {{ `${user.username}#${user.shorthandId}` }}
        </span>
      </template>
    </div>
    <div class="row">
      <q-btn flat round color="white" icon="mdi-tooltip-plus">
        <q-badge
          v-if="user.invites.length !== 0"
          color="teal"
          :label="user.invites.length"
          floating
        />
        <q-menu dark right :offset="[-15, -5]">
          <q-list dense>
            <template v-if="user.invites.length !== 0">
              <q-item v-for="(invite, i) in user.invites" :key="i">
                <q-item-section v-html="invite.txt" />
                <q-item-section side top class="q-py-sm">
                  <q-btn size="sm" color="teal"> Accept </q-btn>
                  <q-btn size="sm" color="" class="q-mt-sm"> Decline </q-btn>
                </q-item-section>
              </q-item>
            </template>
            <q-item v-else>
              <q-item-section> No invites found. </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn flat round color="white" icon="mdi-message-text" @click="openuserSearchDialog" />
      <q-btn flat round color="white" icon="mdi-dots-vertical">
        <q-menu dark right :offset="[-15, -5]">
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>New group</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable v-close-popup @click="$emit('set-left-panel', 'settings')">
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable v-close-popup @click="logOut">
              <q-item-section>Log out</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
  <div class="row q-pa-md bg-light-blue-9" v-if="state.notificationsEnablePanelActive">
    <q-btn color="light-blue-9" flat round icon="mdi-bell" class="bg-grey-5 q-mr-md" />
    <div class="column text-white">
      <span> Get notified of new messages </span>
      <div>
        <span @click="askNotificationPermission" class="enable-desktop-notifications-link">
          Turn on desktop notifications
        </span>
        <q-icon name="mdi-chevron-right" />
      </div>
    </div>
  </div>
  <div class="search-bar-container q-pa-md">
    <q-input bg-color="blue-grey-10" dark dense rounded standout placeholder="Search for a chat">
      <template #prepend>
        <q-icon name="mdi-magnify" />
      </template>
    </q-input>
  </div>
  <q-separator />
  <q-list dark class="rounded-borders user-list-container" :style="state.userListContainerStyle">
    <div v-for="(conversation, i) in conversations" :key="conversation.id">
      <conversation-list-item :conversation="conversation" />
      <q-separator dark inset="item" v-if="i !== conversations.length - 1" />
    </div>
  </q-list>
  <user-search-dialog v-model="state.userSearchDialog" />
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import ConversationListItem from "src/components/ConversationListItem.vue";
import { Notify } from "quasar";
import { ROUTE_NAMES } from "src/router/routeNames";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import UserSearchDialog from "src/components/UserSearchDialog.vue";
import { copyToClipboard } from "src/utils/helpers";

export default defineComponent({
  name: "conversations",
  emits: ["set-left-panel"],
  components: {
    ConversationListItem,
    UserSearchDialog
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const state = reactive({
      userListContainerStyle: computed(() => {
        if (!state.notificationsEnablePanelActive) {
          return {
            height: "calc(100% - 130px)",
            "max-height": "calc(100% - 130px)"
          };
        } else {
          return {
            height: "calc(100% - 204px)",
            "max-height": "calc(100% - 204px)"
          };
        }
      }),
      notificationsEnabled: false,
      notificationsEnablePanelActive: true,
      userSearchDialog: false
    });

    const checkNotificationPromise = () => {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        return false;
      }
      return true;
    };

    const askNotificationPermission = () => {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
      } else {
        if (checkNotificationPromise()) {
          Notification.requestPermission().then((permission) => {
            handlePermission(permission);
          });
        } else {
          Notification.requestPermission((permission) => {
            handlePermission(permission);
          });
        }
      }
    };

    const handlePermission = () => {
      if (Notification.permission === "denied" || Notification.permission === "default") {
        console.log("Nope!");
      } else {
        state.notificationsEnabled = true;
        state.notificationsEnablePanelActive = false;
        // Handle sending notifications here
      }
    };

    const logOut = async () => {
      try {
        Notify.create({
          message: "Signed out!",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
        await store.dispatch("user/logOut");
        router.push({
          name: ROUTE_NAMES.LOGIN
        });
      } catch (e) {
        Notify.create({
          message: e.message,
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    const openuserSearchDialog = () => {
      state.userSearchDialog = true;
    };

    const copyUsernameToClipboard = () => {
      copyToClipboard(
        `${store.getters["user/user"].username}#${store.getters["user/user"].shorthandId}`
      );
      Notify.create({
        message: "Username copied to clipboard",
        position: "top",
        color: "dark",
        textColor: "orange"
      });
    };

    return {
      state,
      askNotificationPermission,
      logOut,
      openuserSearchDialog,
      copyUsernameToClipboard,
      user: computed(() => store.getters["user/user"]),
      conversations: computed(() => store.getters["chats/chats"])
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.search-bar-container {
  background-color: $bg-dark-2;
}

.user-list-container {
  background-color: $bg-dark-2;
  overflow-y: auto;
}

.chat-top {
  background-color: $bg-dark-3;
}

.enable-desktop-notifications-link {
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
