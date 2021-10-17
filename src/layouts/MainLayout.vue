<template>
  <q-layout class="bg">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="row main-container" :style="{ width: `${state.width - 300}px` }">
          <div class="col-3 full-height">
            <keep-alive>
              <component v-bind:is="state.leftPaneComponent" />
            </keep-alive>
          </div>
          <div class="col-9 full-height right-panel">
            <router-view :key="$route.path" />
          </div>
        </div>
        <q-resize-observer @resize="changeMainContainerWidth" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, reactive } from "vue";
import Conversations from "src/components/leftPanel/Conversations.vue";
import Profile from "src/components/leftPanel/Profile.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    Conversations,
    Profile
  },
  setup() {
    const state = reactive({
      width: 0,
      leftPaneComponent: "conversations"
    });

    const changeMainContainerWidth = () => {
      state.width = window.innerWidth - 100;
    };

    return {
      changeMainContainerWidth,
      state
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
