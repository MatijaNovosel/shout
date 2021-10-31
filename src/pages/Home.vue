<template>
  <q-page
    v-if="state.appLoading"
    class="bg-grey-10 window-height window-width row justify-center items-center"
  >
    <div class="row justify-center" style="width: 400px">
      <span class="text-white text-h6 q-mb-md"> Loading ... </span>
      <q-linear-progress color="teal" indeterminate />
    </div>
  </q-page>
  <q-page v-else class="flex flex-center">
    <div class="row main-container" :style="{ width: `${state.width - 300}px` }">
      <div class="col-3 full-height">
        <keep-alive>
          <component @set-left-panel="setLeftPanel" :is="state.leftPaneComponent" />
        </keep-alive>
      </div>
      <div class="col-9 full-height right-panel">
        <router-view></router-view>
      </div>
    </div>
    <q-resize-observer @resize="changeMainContainerWidth" />
  </q-page>
</template>

<script>
import { defineComponent, reactive, computed, onMounted } from "vue";
import Conversations from "src/components/leftPanel/Conversations.vue";
import Profile from "src/components/leftPanel/Profile.vue";
import Settings from "src/components/leftPanel/Settings.vue";
import ChatService from "src/services/chats";
import { useStore } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    Conversations,
    Profile,
    Settings
  },
  setup() {
    const store = useStore();

    const state = reactive({
      width: 0,
      leftPaneComponent: "conversations",
      appLoading: computed(() => store.getters["app/loading"])
    });

    const changeMainContainerWidth = () => {
      state.width = window.innerWidth - 100;
    };

    const setLeftPanel = (name) => {
      state.leftPaneComponent = name;
    };

    onMounted(async () => {
      await store.dispatch("app/setLoading", true);

      const chats = await ChatService.getAll();
      await store.dispatch("chats/setChats", chats);

      setTimeout(async () => {
        await store.dispatch("app/setLoading", false);
      }, 750);
    });

    return {
      changeMainContainerWidth,
      state,
      setLeftPanel
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

.right-panel {
  border-left: 1px solid rgba(255, 255, 255, 0.11);
  background-color: #090e11;
}
</style>
