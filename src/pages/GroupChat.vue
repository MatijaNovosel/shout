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
          <div class="row text-white">
            <q-avatar size="40px">
              <img src="../assets/gopniks.jpg" />
            </q-avatar>
            <div class="column q-ml-md">
              <span> Group chat </span>
              <span> User 1, User 2, User 3, You </span>
            </div>
          </div>
          <div class="row">
            <q-btn
              @click="$router.push({ name: indexRoute })"
              flat
              round
              color="white"
              icon="mdi-arrow-left"
            />
            <q-btn flat round color="white" icon="mdi-magnify" />
            <q-btn flat round color="white" icon="mdi-comment-text-multiple">
              <q-menu dark left>
                <q-list dense style="min-width: 100px">
                  <q-item active active-class="text-white" clickable v-close-popup>
                    <q-item-section>Text channel 1</q-item-section>
                  </q-item>
                  <q-separator dark />
                  <q-item clickable v-close-popup class="text-grey">
                    <q-item-section>Text channel 2</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn flat round color="white" icon="mdi-dots-vertical">
              <q-menu dark left>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup @click="openRightPanel">
                    <q-item-section>Group info</q-item-section>
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
                    <q-item-section>Downloads</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Exit group</q-item-section>
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
        <div class="chat-bottom">
          <div class="row justify-between q-py-sm q-px-md">
            <div class="col-2 row justify-center">
              <q-btn flat round color="white" icon="mdi-emoticon" />
              <q-btn flat round color="white" icon="mdi-paperclip" />
            </div>
            <div class="col-8 row justify-center">
              <q-input
                dark
                dense
                rounded
                standout
                placeholder="Type a message"
                v-model="state.msgText"
                class="full-width"
              />
            </div>
            <div class="col-2 row justify-center">
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
      <group-details @close="state.rightPanelOpen = false" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import { range, randInt, downloadURI } from "src/utils/helpers";
import { loremIpsum, MSG_TYPE } from "src/utils/constants";
import { format } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";
import MessagePanel from "src/components/chat/MessagePanel.vue";
import GroupDetails from "src/components/chat/rightPanel/GroupDetails.vue";

export default defineComponent({
  name: "ChatDetails",
  components: {
    MessagePanel,
    GroupDetails
  },
  setup() {
    const state = reactive({
      messages: [],
      recording: false,
      recordingCancelled: false,
      mediaRecorder: null,
      recordedChunks: [],
      msgText: null,
      shouldShowScrollToBottom: false,
      scrollToBottomTrigger: false,
      rightPanelOpen: false
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

    const download = () => {
      downloadURI(
        URL.createObjectURL(new Blob(state.recordedChunks)),
        `${format(new Date(), "ddMMyyyyHHmm")}.wav`
      );
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

    const openRightPanel = () => {
      state.rightPanelOpen = true;
    };

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
      scrollToEndOfMsgContainer();
    });

    return {
      state,
      record,
      stopRecording,
      sendTxtMsg,
      scrollToEndOfMsgContainer,
      shouldShowScrollToBottom,
      indexRoute: ROUTE_NAMES.INDEX,
      openRightPanel
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

.scroll-to-bottom-fab {
  position: absolute;
  bottom: 85px;
  right: 35px;
}
</style>
