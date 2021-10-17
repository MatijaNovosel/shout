<template>
  <q-layout class="bg">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="row main-container" :style="{ width: `${state.width - 300}px` }">
          <div class="col-3 full-height">
            <div class="chat-top row justify-between q-py-sm q-px-md">
              <q-avatar size="40px">
                <img src="../assets/me.jpg" />
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
                      <q-item clickable v-close-popup>
                        <q-item-section>Settings</q-item-section>
                      </q-item>
                      <q-separator dark />
                      <q-item clickable v-close-popup>
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
                  <span
                    @click="askNotificationPermission"
                    class="enable-desktop-notifications-link"
                  >
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
            <q-list
              dark
              class="rounded-borders user-list-container"
              :style="state.userListContainerStyle"
            >
              <div v-for="(conversation, i) in state.conversations" :key="conversation.id">
                <conversation-list-item :conversation="conversation" />
                <q-separator dark inset="item" v-if="i !== state.conversations.length - 1" />
              </div>
            </q-list>
          </div>
          <div class="col-9 full-height chat-panel">
            <router-view />
          </div>
        </div>
        <q-resize-observer @resize="changeMainContainerWidth" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, reactive, computed, onMounted } from "vue";
import { CONVERSTATION_TYPE, MSG_TYPE } from "../utils/constants";
import ConversationListItem from "src/components/ConversationListItem.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    ConversationListItem
  },
  setup() {
    const state = reactive({
      width: 0,
      conversations: [],
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

    const changeMainContainerWidth = () => {
      state.width = window.innerWidth - 100;
    };

    onMounted(() => {
      const selfConversation = {
        id: 1,
        type: CONVERSTATION_TYPE.SELF,
        name: "Self conversation",
        lastMsg: {
          txt: "Hello!",
          sentAt: new Date(),
          type: MSG_TYPE.TXT,
          you: true
        }
      };

      const privateConversation = {
        id: 2,
        otherUser: {
          id: 2,
          name: "Name Surname",
          avatar: "url/image.jpg"
        },
        name: "Name surname",
        type: CONVERSTATION_TYPE.PRIVATE,
        lastMsg: {
          txt: "Hello!",
          you: true,
          sentAt: new Date(),
          type: MSG_TYPE.TXT
        }
      };

      const groupConversation = {
        id: 3,
        name: "Group convo",
        avatar: "url/image.jpg",
        type: CONVERSTATION_TYPE.GROUP,
        lastMsg: {
          txt: "Hello!",
          you: false,
          userName: "Some user",
          sentAt: new Date(),
          type: MSG_TYPE.TXT
        }
      };

      state.conversations.push(selfConversation);
      state.conversations.push(privateConversation);
      state.conversations.push(groupConversation);
    });

    return {
      changeMainContainerWidth,
      state,
      askNotificationPermission
    };
  }
});
</script>

<style scoped lang="scss">
.bg {
  background-color: #090e11;
}

.main-container {
  height: calc(100vh - 38px);
  background-color: #262d31;
}

.search-bar-container {
  background-color: #131c21;
}

.user-list-container {
  background-color: #131c21;
  overflow-y: auto;
}

.chat-top {
  background-color: #2a2f32;
}

.chat-panel {
  border-left: 1px solid rgba(255, 255, 255, 0.24);
  background-color: rgb(15, 14, 14);
}

.enable-desktop-notifications-link {
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
