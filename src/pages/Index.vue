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
    <div class="messages-container row q-px-xl q-py-md">
      <div
        v-for="message in state.messages"
        :key="message.id"
        class="col-12 row"
        :class="{
          'justify-end': message.sent
        }"
      >
        <q-chat-message
          :text="[message.txt]"
          stamp="7 minutes ago"
          :sent="message.sent"
          :bg-color="message.sent ? 'teal-9' : 'blue-grey-9'"
          text-color="white"
          class="chat-msg full-width"
        />
      </div>
    </div>
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
import { defineComponent, reactive, onMounted } from "vue";
import { range, randInt } from "src/utils/helpers";
import { loremIpsum } from "src/utils/constants";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const state = reactive({
      messages: []
    });

    onMounted(() => {
      state.messages = range(15).map((n) => {
        const userId = randInt(1, 2);

        return {
          userId,
          txt: loremIpsum.substr(0, randInt(10, loremIpsum.length)),
          sent: userId === 1
        };
      });
    });

    return {
      state
    };
  }
});
</script>

<style scoped lang="scss">
.chat-panel-bg {
  position: relative;
  background-image: url("../assets/bgTransparent.png");
  background-repeat: repeat;
}

.chat-top {
  background-color: #2a2f32;
}

.chat-bottom {
  background-color: #2a2f32;
  height: 58px;
}

.messages-container {
  max-height: calc(100% - 116px);
  overflow-y: scroll;
}

.chat-msg {
  max-width: 85%;
}
</style>
