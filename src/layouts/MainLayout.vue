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
            <div class="search-bar-container q-pa-md">
              <q-input dark dense rounded standout placeholder="Search or start a new chat">
                <template #prepend>
                  <q-icon name="mdi-magnify" />
                </template>
              </q-input>
            </div>
            <q-separator />
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
                  <q-menu dark touch-position context-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section>Open...</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>New</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable>
                        <q-item-section>Preferences</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu dark anchor="top end" self="top start">
                          <q-list>
                            <q-item v-for="n in 3" :key="n" dense clickable>
                              <q-item-section>Submenu Label</q-item-section>
                              <q-item-section side>
                                <q-icon name="keyboard_arrow_right" />
                              </q-item-section>
                              <q-menu dark auto-close anchor="top end" self="top start">
                                <q-list>
                                  <q-item v-for="n in 3" :key="n" dense clickable>
                                    <q-item-section>3rd level Label</q-item-section>
                                  </q-item>
                                </q-list>
                              </q-menu>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup>
                        <q-item-section>Quit</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-separator dark inset="item" v-if="n != 20" />
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

.search-bar-container {
  background-color: #131c21;
}

.user-list-container {
  background-color: #131c21;
  overflow-y: auto;
  height: calc(100% - 130px);
  max-height: calc(100% - 130px);
}

.chat-top {
  background-color: #2a2f32;
}

.chat-panel {
  border-left: 1px solid rgba(241, 241, 242, 0.11);
  background-color: rgb(15, 14, 14);
}
</style>
