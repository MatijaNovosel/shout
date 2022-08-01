<template>
  <div class="row full-height">
    <div
      class="full-height"
      :class="{
        'col-12': !state.rightPanelOpen,
        'col-8': state.rightPanelOpen
      }"
    >
      <div class="column full-height chat-panel-bg justify-between">
        <div class="chat-top row justify-between q-py-sm q-px-md">
          <div
            class="row text-white cursor-pointer"
            @click="openRightPanel(PRIVATE_CHAT_RIGHT_PANEL.DETAILS)"
          >
            <q-avatar size="40px">
              <img src="/plenkovic.jpg" />
            </q-avatar>
            <div class="column q-ml-md">
              <span> {{ contactDetails.name }} </span>
              <span> Online </span>
            </div>
          </div>
          <div class="row">
            <q-btn
              @click="$router.push({ name: ROUTE_NAMES.INDEX })"
              flat
              round
              color="white"
              icon="mdi-arrow-left"
            />
            <q-btn
              @click="openRightPanel(PRIVATE_CHAT_RIGHT_PANEL.SEARCH)"
              flat
              round
              color="white"
              icon="mdi-magnify"
            />
            <q-btn flat round color="white" icon="mdi-dots-vertical">
              <q-menu dark right :offset="[-15, -5]">
                <q-list dense style="min-width: 100px">
                  <q-item
                    @click="openRightPanel(PRIVATE_CHAT_RIGHT_PANEL.DETAILS)"
                    clickable
                    v-close-popup
                  >
                    <q-item-section>Contact info</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Select messages</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Mute notifications</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Clear messages</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Delete chat</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
        <message-panel
          @should-show-scroll-to-bottom="shouldShowScrollToBottom"
          :messages="state.messages"
          :scroll-to-bottom-trigger="state.scrollToBottomTrigger"
        />
        <div class="bottom-bar q-py-sm q-px-md">
          <div class="bottom-bar-left">
            <q-btn flat round color="white" icon="mdi-emoticon" />
            <q-btn flat round color="white" icon="mdi-paperclip" />
          </div>
          <div class="bottom-bar-center">
            <q-input
              dark
              dense
              rounded
              standout
              placeholder="Type a message"
              v-model="state.msgText"
            />
          </div>
          <div class="bottom-bar-right">
            <template v-if="state.msgText !== null && state.msgText !== ''">
              <q-btn flat round color="white" icon="mdi-arrow-right" @click="sendTxtMsg" />
            </template>
            <template v-else>
              <q-btn
                flat
                round
                color="white"
                icon="mdi-microphone"
                @click="record"
                v-if="!state.recording"
              />
              <template v-else>
                <q-btn
                  flat
                  round
                  color="red"
                  icon="mdi-arrow-left-circle"
                  @click="stopRecording(true)"
                />
                <q-btn
                  flat
                  round
                  color="green"
                  icon="mdi-check-circle-outline"
                  @click="stopRecording(false)"
                />
              </template>
            </template>
          </div>
          <q-btn
            v-show="state.shouldShowScrollToBottom"
            @click="scrollToEndOfMsgContainer"
            fab
            icon="mdi-chevron-down"
            color="grey-9"
            class="scroll-to-bottom-fab"
          />
        </div>
      </div>
    </div>
    <div class="col-4" v-show="state.rightPanelOpen">
      <keep-alive>
        <contact-details
          v-if="state.activeRightPanel === PRIVATE_CHAT_RIGHT_PANEL.DETAILS"
          :contact-details="contactDetails"
          @close="state.rightPanelOpen = false"
        />
      </keep-alive>
      <keep-alive>
        <private-chat-search
          v-if="state.activeRightPanel === PRIVATE_CHAT_RIGHT_PANEL.SEARCH"
          @close="state.rightPanelOpen = false"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { range, randInt } from "src/utils/helpers";
import { loremIpsum, MSG_TYPE, PRIVATE_CHAT_RIGHT_PANEL } from "src/utils/constants";
import MessagePanel from "src/components/chat/MessagePanel.vue";
import ContactDetails from "src/components/chat/rightPanel/ContactDetails.vue";
import PrivateChatSearch from "src/components/chat/rightPanel/PrivateChatSearch.vue";
import { ROUTE_NAMES } from "src/router/routeNames";

const contactDetails = {
  name: "Name Surname",
  status: "Name Surname status"
};

const state = reactive({
  messages: [],
  recording: false,
  recordingCancelled: false,
  rightPanelOpen: false,
  mediaRecorder: null,
  recordedChunks: [],
  msgText: null,
  shouldShowScrollToBottom: false,
  scrollToBottomTrigger: false,
  activeRightPanel: PRIVATE_CHAT_RIGHT_PANEL.DETAILS
});

const stopRecording = (cancel) => {
  state.recording = false;
  if (cancel === true) {
    state.recordingCancelled = cancel;
    state.mediaRecorder = null;
  } else {
    state.recordingCancelled = cancel;
    state.mediaRecorder.stop();
    state.recordedChunks = [];
  }
};

const handleSuccess = (stream) => {
  state.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  state.mediaRecorder.addEventListener("dataavailable", (e) => {
    if (e.data.size > 0) {
      state.recordedChunks.push(e.data);
    }
  });
  state.mediaRecorder.addEventListener("stop", () => {
    if (!state.recordingCancelled) {
      state.messages.push({
        userId: 1,
        sent: true,
        type: MSG_TYPE.AUDIO,
        audioContent: URL.createObjectURL(new Blob(state.recordedChunks))
      });
      scrollToEndOfMsgContainer();
    }
  });
  state.mediaRecorder.start();
};

const scrollToEndOfMsgContainer = () => {
  state.scrollToBottomTrigger = !state.scrollToBottomTrigger;
};

const record = () => {
  state.recording = true;
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
};

const sendTxtMsg = () => {
  if (state.msgText !== null && state.msgText !== "" && state.msgText.length > 4) {
    state.messages.push({
      userId: 1,
      sent: true,
      type: MSG_TYPE.TXT,
      txt: state.msgText
    });
    state.msgText = null;
    scrollToEndOfMsgContainer();
  }
};

const shouldShowScrollToBottom = (val) => {
  state.shouldShowScrollToBottom = val;
};

const openRightPanel = (rightPanel) => {
  state.activeRightPanel = rightPanel;
  state.rightPanelOpen = true;
};

onMounted(() => {
  state.messages = range(15).map((n) => {
    const userId = randInt(1, 2);
    return {
      userId,
      txt: loremIpsum.substring(0, randInt(10, loremIpsum.length)),
      sent: userId === 1,
      type: MSG_TYPE.TXT
    };
  });
  scrollToEndOfMsgContainer();
});
</script>

<style scoped lang="scss">
@import "src/utils/variables.scss";

.chat-panel-bg {
  position: relative;
  background-image: url("../assets/bgTransparent.png");
  background-repeat: repeat;
}

.chat-top {
  background-color: $bg-dark-3;
}

.chat-bottom {
  background-color: $bg-dark-3;
  height: 58px;
}

.scroll-to-bottom-fab {
  position: absolute;
  bottom: 85px;
  right: 35px;
}

.bottom-bar {
  background-color: $bg-dark-3;
  height: 58px;
  display: flex;
  width: 100%;
}

.bottom-bar-left {
  flex-grow: 1;
  text-align: center;
}

.bottom-bar-center {
  flex-grow: 10;
}

.bottom-bar-right {
  flex-grow: 1;
  text-align: center;
}
</style>
