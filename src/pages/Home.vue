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
    <div class="row main-container" :style="{ width: `${state.width - 300}px` }">
      <div class="col-3 full-height">
        <transition
          enter-active-class="animated slideInLeft"
          leave-active-class="animated slideInRight"
          appear
          :duration="300"
        >
          <div :key="state.leftPaneComponentName" style="display: contents">
            <component @set-left-panel="setLeftPanel" :is="leftPaneComponent" />
          </div>
        </transition>
      </div>
      <div class="col-9 full-height right-panel">
        <router-view />
      </div>
    </div>
    <q-resize-observer @resize="changeMainContainerWidth" />
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
  width: 0,
  appLoading: computed(() => store.getters["app/loading"]),
  loadedAt: new Date(),
  leftPaneComponentName: "conversations"
});

const changeMainContainerWidth = () => {
  state.width = window.innerWidth - 100;
};

const setLeftPanel = (name) => {
  if (state.leftPaneComponentName === name) {
    return;
  }

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
};

const getConversations = async () => {
  // const chats = await ChatService.getAll(store.getters["user/user"].id);
  await store.dispatch("chats/setChats", []);
};

onMounted(async () => {
  await store.dispatch("app/setLoading", true);
  await getConversations();
  setTimeout(async () => {
    await store.dispatch("app/setLoading", false);
  }, 750);
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
  background-color: #262d31;
}

.right-panel {
  border-left: 1px solid rgba(255, 255, 255, 0.11);
  background-color: #090e11;
}
</style>
