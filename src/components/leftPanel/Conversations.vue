<template>
  <div class="chat-top row justify-between q-py-sm q-px-md">
    <q-avatar class="cursor-pointer" @click="$emit('set-left-panel', 'profile')" size="40px">
      <img src="../../assets/me.jpg" />
    </q-avatar>
    <div class="row">
      <q-btn flat round color="white" icon="mdi-circle-outline" />
      <q-btn flat round color="white" icon="mdi-message-text" />
      <q-btn flat round color="white" icon="mdi-dots-vertical">
        <q-menu dark right :offset="[-15, -5]">
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>New group</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable v-close-popup>
              <q-item-section>Archived</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable v-close-popup>
              <q-item-section>Pinned</q-item-section>
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
    <q-input
      bg-color="blue-grey-10"
      dark
      dense
      rounded
      standout
      placeholder="Search or start a new chat"
    >
      <template #prepend>
        <q-icon name="mdi-magnify" />
      </template>
    </q-input>
  </div>
  <q-separator />
  <q-list dark class="rounded-borders user-list-container" :style="state.userListContainerStyle">
    <div v-for="(conversation, i) in state.conversations" :key="conversation.id">
      <conversation-list-item :conversation="conversation" />
      <q-separator dark inset="item" v-if="i !== state.conversations.length - 1" />
    </div>
  </q-list>
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import ConversationListItem from "src/components/ConversationListItem.vue";
import firebase from "firebase";
import { Notify } from "quasar";
import { ROUTE_NAMES } from "src/router/routeNames";
import router from "src/router/index";
import { useStore } from "vuex";

export default defineComponent({
  name: "conversations",
  emits: ["set-left-panel"],
  components: {
    ConversationListItem
  },
  setup() {
    const store = useStore();

    const state = reactive({
      conversations: computed(() => {
        return store.getters["chats/chats"];
      }),
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
      notificationsEnablePanelActive: true
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
          Notification.requestPermission().then(permission => {
            handlePermission(permission);
          });
        } else {
          Notification.requestPermission(permission => {
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
        await firebase.auth().signOut();
        Notify.create({
          message: "Signed out!",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
        router().push({
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

    return {
      state,
      askNotificationPermission,
      logOut,
      store
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
