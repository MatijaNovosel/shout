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
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section>New tab</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>New incognito tab</q-item-section>
                      </q-item>
                      <q-separator dark />
                      <q-item clickable v-close-popup>
                        <q-item-section>Recent tabs</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>History</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>Downloads</q-item-section>
                      </q-item>
                      <q-separator dark />
                      <q-item clickable v-close-popup>
                        <q-item-section>Settings</q-item-section>
                      </q-item>
                      <q-separator dark />
                      <q-item clickable v-close-popup>
                        <q-item-section>Help &amp; Feedback</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
            <q-list dark class="rounded-borders user-list-container">
              <div v-for="n in 20" :key="n">
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">Brunch this weekend?</q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold">Janet</span>
                      -- I'll be in your neighborhood doing errands this weekend. Do you want to
                      grab brunch?
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top> 1 min ago </q-item-section>
                </q-item>
                <q-separator dark inset="item" v-if="n != 19" />
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
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const state = reactive({
      width: 0
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

.user-list-container {
  background-color: #131c21;
  overflow-y: auto;
  height: calc(100% - 58px);
  max-height: calc(100% - 58px);
}

.chat-top {
  background-color: #2a2f32;
}

.chat-panel {
  border-left: 1px solid rgba(241, 241, 242, 0.11);
}
</style>
