<template>
  <div class="column full-height chat-panel-bg justify-between">
    <div class="chat-top row justify-between q-py-sm q-px-md">
      <div class="row text-white">
        <q-avatar size="40px">
          <img src="../assets/plenkovic.jpg" />
        </q-avatar>
        <div class="column q-ml-md">
          <span> Andrej Plenković </span>
          <span> Online </span>
        </div>
      </div>
      <div class="row">
        <q-btn flat round color="white" icon="mdi-magnify" />
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
    <div>Hello</div>
    <div class="chat-bottom">
      <div class="row justify-between q-py-sm q-px-md">
        <div class="col-1">
          <q-btn flat round color="white" icon="mdi-emoticon" />
          <q-btn flat round color="white" icon="mdi-paperclip" />
        </div>
        <div class="col-10">
          <q-input dark dense rounded standout placeholder="Type a message" />
        </div>
        <div class="col-1 text-center">
          <q-btn flat round color="white" icon="mdi-microphone" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  setup() {
    return {};
  }
});
</script>

<style scoped lang="scss">
.chat-panel-bg {
  position: relative;
  background-image: url("../assets/bg.png");
  background-repeat: repeat;
}

.chat-top {
  background-color: #2a2f32;
}

.chat-bottom {
  background-color: #2a2f32;
  height: 58px;
}
</style>
