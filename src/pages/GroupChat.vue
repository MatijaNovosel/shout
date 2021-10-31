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
            @click="openRightPanel(GROUP_CHAT_RIGHT_PANEL.DETAILS)"
          >
            <q-avatar size="40px">
              <img src="../assets/gopniks.jpg" />
            </q-avatar>
            <div class="column q-ml-md" v-if="state.chatDetails">
              <span> {{ state.chatDetails.name }} </span>
              <span> {{ state.chatDetails.users.map((u) => u.username).join(", ") }} </span>
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
            <q-btn
              @click="openRightPanel(GROUP_CHAT_RIGHT_PANEL.SEARCH)"
              flat
              round
              color="white"
              icon="mdi-magnify"
            />
            <q-btn flat round color="white" icon="mdi-pin">
              <q-menu dark anchor="bottom left" self="top left">
                <q-list style="min-width: 200px">
                  <q-item clickable>
                    <q-item-section top avatar>
                      <q-avatar>
                        <img src="../assets/me.jpg" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> You </q-item-label>
                      <q-item-label caption class="text-grey">
                        Some long message bla bla bla
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable>
                    <q-item-section top avatar>
                      <q-avatar>
                        <img src="../assets/me.jpg" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label> You </q-item-label>
                      <q-item-label caption class="text-grey">
                        Other message bla bla bla message bla bla
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
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
                  <q-item
                    clickable
                    v-close-popup
                    @click="openRightPanel(GROUP_CHAT_RIGHT_PANEL.DETAILS)"
                  >
                    <q-item-section>Group info</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="state.selectMode = true">
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
        <keep-alive>
          <message-panel
            v-show="!state.addingFile"
            @should-show-scroll-to-bottom="shouldShowScrollToBottom"
            @file-uploaded="fileUploaded"
            :messages="state.messages"
            :scroll-to-bottom-trigger="state.scrollToBottomTrigger"
            :emoji-panel-open="state.emojiPanelOpen"
            :select-mode="state.selectMode"
            :file-picker-trigger="state.filePickerTrigger"
          />
        </keep-alive>
        <keep-alive>
          <add-file-panel
            @close="state.addingFile = false"
            :files="state.files"
            v-show="state.addingFile"
            @trigger-file-picker="triggerFilePicker"
          />
        </keep-alive>
        <div class="emoji-panel" v-if="state.emojiPanelOpen">
          <emoji-picker @close="state.emojiPanelOpen = false" @emoji="insertEmoji" />
        </div>
        <div class="bottom-bar q-py-sm q-px-md" v-show="!state.addingFile">
          <div class="bottom-bar-left">
            <q-btn
              flat
              round
              :color="state.emojiPanelOpen ? 'teal' : 'white'"
              icon="mdi-emoticon"
              @click="openEmojiPanel"
            />
          </div>
          <div class="bottom-bar-center">
            <q-input
              dark
              dense
              rounded
              standout
              placeholder="Type a message or upload a file by dragging"
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
                  icon="mdi-close-circle"
                  @click="stopRecording(true)"
                />
                <span class="text-white">
                  {{ state.elapsedRecordingSecondsFormatted }}
                </span>
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
            v-show="state.shouldShowScrollToBottom && !state.addingFile"
            @click="scrollToEndOfMsgContainer"
            fab
            icon="mdi-chevron-down"
            color="grey-9"
            class="scroll-to-bottom-fab"
            :style="state.fabStyle"
          />
        </div>
      </div>
    </div>
    <div class="col-4" v-show="state.rightPanelOpen">
      <keep-alive>
        <group-details
          v-if="state.activeRightPanel === GROUP_CHAT_RIGHT_PANEL.DETAILS && state.chatDetails"
          :group-details="state.chatDetails"
          @close="state.rightPanelOpen = false"
        />
      </keep-alive>
      <keep-alive>
        <group-chat-search
          v-if="state.activeRightPanel === GROUP_CHAT_RIGHT_PANEL.SEARCH"
          @close="state.rightPanelOpen = false"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, computed } from "vue";
import { range, randInt, downloadURI, secondsToElapsedTime } from "src/utils/helpers";
import { loremIpsum, MSG_TYPE, GROUP_CHAT_RIGHT_PANEL } from "src/utils/constants";
import { format } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";
import MessagePanel from "src/components/chat/MessagePanel.vue";
import GroupDetails from "src/components/chat/rightPanel/GroupDetails.vue";
import GroupChatSearch from "src/components/chat/rightPanel/GroupChatSearch.vue";
import EmojiPicker from "src/components/chat/EmojiPicker.vue";
import AddFilePanel from "src/components/AddFilePanel.vue";
import { useRoute } from "vue-router";
import ChatService from "src/services/chats";

export default defineComponent({
  name: "ChatDetails",
  components: {
    MessagePanel,
    GroupDetails,
    GroupChatSearch,
    EmojiPicker,
    AddFilePanel
  },
  setup() {
    const route = useRoute();

    const state = reactive({
      addingFile: false,
      filePickerTrigger: false,
      messages: [],
      selectMode: false,
      files: [],
      elapsedRecordingSeconds: 0,
      elapsedRecordingSecondsFormatted: computed(() => {
        const { m, s } = secondsToElapsedTime(state.elapsedRecordingSeconds);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      }),
      chatDetails: null,
      recording: false,
      emojiPanelOpen: false,
      recordingCancelled: false,
      mediaRecorder: null,
      recordingInterval: null,
      recordedChunks: [],
      msgText: null,
      shouldShowScrollToBottom: false,
      scrollToBottomTrigger: false,
      rightPanelOpen: false,
      activeRightPanel: GROUP_CHAT_RIGHT_PANEL.DETAILS,
      fabStyle: computed(() => {
        if (state.emojiPanelOpen === true) {
          return {
            bottom: "285px"
          };
        } else {
          return {
            bottom: "85px"
          };
        }
      })
    });

    const stopRecording = (cancel) => {
      state.recording = false;
      clearInterval(state.recordingInterval);
      state.elapsedRecordingSeconds = 0;
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
      state.recordingInterval = setInterval(() => {
        state.elapsedRecordingSeconds++;
      }, 1000);
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

    const triggerFilePicker = () => {
      state.filePickerTrigger = !state.filePickerTrigger;
    };

    const shouldShowScrollToBottom = (val) => {
      state.shouldShowScrollToBottom = val;
    };

    const openRightPanel = (rightPanel) => {
      state.activeRightPanel = rightPanel;
      state.rightPanelOpen = true;
    };

    const insertEmoji = (emoji) => {
      if (state.msgText === null) {
        state.msgText = emoji;
      } else {
        state.msgText += emoji;
      }
    };

    const fileUploaded = (files) => {
      state.addingFile = true;
      state.files = [...files];
    };

    const openEmojiPanel = () => {
      state.emojiPanelOpen = !state.emojiPanelOpen;
    };

    onMounted(async () => {
      const uid = route.params.id;
      state.chatDetails = await ChatService.getDetails(uid);
      state.messages = range(15).map(() => {
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
      openRightPanel,
      GROUP_CHAT_RIGHT_PANEL,
      insertEmoji,
      fileUploaded,
      triggerFilePicker,
      openEmojiPanel
    };
  }
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

.scroll-to-bottom-fab {
  position: absolute;
  right: 35px;
}

.emoji-panel {
  height: 200px;
}
</style>
