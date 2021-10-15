<template>
  <q-page class="flex flex-center">
    <div class="row main-container" :style="{ width: `${state.width - 300}px` }">
      <div class="col-3 full-height user-list">
        <q-list dark class="rounded-borders">
          <div class="chat-top row justify-between q-py-sm q-px-md">
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <div class="row">
              <q-btn flat round color="white" icon="mdi-circle-outline" />
              <q-btn flat round color="white" icon="mdi-message-text" />
              <q-btn flat round color="white" icon="mdi-dots-vertical" />
            </div>
          </div>
          <q-item-label header>Friends</q-item-label>
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
                -- I'll be in your neighborhood doing errands this weekend. Do you want to grab
                brunch?
              </q-item-label>
            </q-item-section>
            <q-item-section side top> 1 min ago </q-item-section>
          </q-item>
          <q-separator dark inset="item" />
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">Linear Project</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">John</span>
                -- Can we schedule a call for tomorrow?
              </q-item-label>
            </q-item-section>
            <q-item-section side top> 1 min ago </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-9 full-height chat-panel">
        <div class="row justify-center items-center text-center full-height">Hello</div>
      </div>
    </div>
    <q-resize-observer @resize="changeMainContainerWidth" />
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const state = reactive({
      width: 0
    });

    const changeMainContainerWidth = () => {
      state.width = window.innerWidth - 100;
      console.log(state.width);
    };

    return {
      changeMainContainerWidth,
      state
    };
  }
});
</script>

<style scoped lang="scss">
.main-container {
  height: calc(100vh - 38px);
  background-color: #262d31;
}
.user-list {
  background-color: #131c21;
}
.chat-top {
  background-color: #2a2f32;
}
.chat-panel {
  border-left: 1px solid rgba(241, 241, 242, 0.11);
}
</style>
