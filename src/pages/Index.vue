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
    <q-scroll-area
      :thumb-style="{
        right: '2px',
        backgroundColor: '#97999c',
        width: '5px',
        opacity: 0.75
      }"
      class="msg-container row q-px-xl q-py-md"
      ref="msgContainer"
    >
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
    </q-scroll-area>
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
import { defineComponent, reactive, onMounted, ref, nextTick } from "vue";
import { range, randInt } from "src/utils/helpers";
import { loremIpsum } from "src/utils/constants";

const MSG_TYPE = {
  TXT: 1,
  AUDIO: 2,
  REPLY: 3,
  IMG: 4,
  VID: 5,
  GIF: 6
};

export default defineComponent({
  name: "PageIndex",
  setup() {
    const msgContainer = ref(null);

    const state = reactive({
      messages: []
    });

    onMounted(() => {
      state.messages = range(15).map((n) => {
        const userId = randInt(1, 2);
        return {
          userId,
          txt: loremIpsum.substr(0, randInt(10, loremIpsum.length)),
          sent: userId === 1,
          type: MSG_TYPE.TXT
        };
      });
      nextTick(() => {
        msgContainer.value.setScrollPosition("vertical", 9999);
      });
    });

    return {
      state,
      msgContainer
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

.msg-container {
  max-height: calc(100% - 116px);
  height: calc(100% - 116px);
}

.chat-msg {
  max-width: 85%;
}
</style>
