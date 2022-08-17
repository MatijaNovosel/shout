<template>
  <q-page
    v-show="state.appLoading"
    class="bg-grey-10 window-height window-width row justify-center items-center"
  >
    <div class="row justify-center" style="width: 400px">
      <span class="text-white text-h6 q-mb-md">
        {{ $t("loading") }}
      </span>
      <q-linear-progress color="orange" indeterminate />
    </div>
  </q-page>
  <q-page v-show="!state.appLoading" class="flex flex-center">
    <div class="row main-container">
      <div class="full-height left-pane">
        <component
          @set-left-panel="setLeftPanel"
          :is="leftPaneComponent"
          :key="state.leftPaneComponentName"
          class="full-height"
        />
      </div>
      <div class="right-pane full-height">
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, computed, onMounted, shallowRef } from "vue";
import Conversations from "src/components/leftPanel/Conversations.vue";
import Profile from "src/components/leftPanel/Profile.vue";
import Settings from "src/components/leftPanel/Settings.vue";
import ChatService from "src/services/chats";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

const store = useStore();
const leftPaneComponent = shallowRef(Conversations);
const { locale } = useI18n({ useScope: "global" });

const state = reactive({
  appLoading: computed(() => store.getters["app/loading"]),
  loadedAt: new Date(),
  leftPaneComponentName: "conversations"
});

const setLeftPanel = (name) => {
  if (state.leftPaneComponentName !== name) {
    switch (name) {
      case "conversations":
        leftPaneComponent.value = Conversations;
        break;
      case "profile":
        leftPaneComponent.value = Profile;
        break;
      case "settings":
        leftPaneComponent.value = Settings;
        break;
    }

    state.leftPaneComponentName = name;
  }
};

const getConversations = async () => {
  const chats = await ChatService.getAll(store.getters["user/user"].id);
  await store.dispatch("chats/setChats", chats);
};

onMounted(async () => {
  await store.dispatch("app/setLoading", true);
  await getConversations();
  await store.dispatch("app/setLoading", false);
  locale.value = store.getters["user/user"].lang;
});

/*
firebase
  .firestore()
  .collection("/chats")
  .where("userIds", "array-contains", store.getters["user/user"].id)
  .onSnapshot(async (snapshot) => {
    let changes = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (isAfter(new Date(data.lastChangedAt.seconds * 1000), state.loadedAt)) {
        if (
          [
            GROUP_CHANGE_TYPE.NAME,
            GROUP_CHANGE_TYPE.AVATAR,
            GROUP_CHANGE_TYPE.MESSAGE_SENT
          ].includes(data.changeType)
        ) {
          changes++;
        }
      }
    });
    if (changes !== 0) {
      await getConversations();
    }
  });
  */
</script>

<style scoped lang="scss">
.bg {
  background-color: #090e11;
}

.main-container {
  height: calc(100vh - 38px);
  width: calc(100% - 300px);
  background-color: #262d31;
}

.right-pane {
  border-left: 1px solid rgba(255, 255, 255, 0.11);
  background-color: #090e11;
  width: 75%;
}

.left-pane {
  width: 25%;
  transform: translateX(0px);
  transition-duration: 150ms;
}
</style>
