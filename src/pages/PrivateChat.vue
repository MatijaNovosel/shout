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
        <q-btn
          @click="$router.push({ name: indexRoute })"
          flat
          round
          color="white"
          icon="mdi-close"
        />
      </div>
    </div>
    <message-panel
      @should-show-scroll-to-bottom="shouldShowScrollToBottom"
      :messages="state.messages"
      :scroll-to-bottom-trigger="state.scrollToBottomTrigger"
    />
    <div class="chat-bottom">
      <div class="row justify-between q-py-sm q-px-md">
        <div class="col-1">
          <q-btn flat round color="white" icon="mdi-emoticon" />
          <q-btn flat round color="white" icon="mdi-paperclip" />
        </div>
        <div class="col-10">
          <q-input
            dark
            dense
            rounded
            standout
            placeholder="Type a message"
            v-model="state.msgText"
          />
        </div>
        <div class="col-1 text-center">
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
              <q-btn flat round color="red" icon="mdi-close-circle" @click="stopRecording(true)" />
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
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import { range, randInt, downloadURI } from "src/utils/helpers";
import { loremIpsum, MSG_TYPE } from "src/utils/constants";
import { format } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";
import MessagePanel from "src/components/chat/MessagePanel.vue";

export default defineComponent({
  name: "ChatDetails",
  components: {
    MessagePanel
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
      scrollToBottomTrigger: false
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
      indexRoute: ROUTE_NAMES.INDEX
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
