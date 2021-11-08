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
        <div class="chat-top row justify-between q-py-sm">
          <q-linear-progress
            v-if="state.loading"
            dark
            rounded
            indeterminate
            color="secondary"
            class="chat-top-loading-bar"
          />
          <div
            class="row text-white cursor-pointer q-pl-md"
            @click="openRightPanel(GROUP_CHAT_RIGHT_PANEL.DETAILS)"
          >
            <q-avatar size="40px">
              <img src="../assets/gopniks.jpg" />
            </q-avatar>
            <div class="column q-ml-md justify-center">
              <span v-if="state.loading"> Loading ... </span>
              <template v-else>
                <template v-if="state.chatDetails">
                  <span> {{ state.chatDetails.name }} </span>
                  <span> {{ state.chatDetails.users.map((u) => u.username).join(", ") }} </span>
                </template>
              </template>
            </div>
          </div>
          <div class="row q-mr-md">
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
                  <q-item clickable v-close-popup @click="messageSelectMode = true">
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
            @delete-msg="deleteMsg"
            @select-messages="messageSelectMode = true"
            @open-details="openRightPanel(GROUP_CHAT_RIGHT_PANEL.DETAILS)"
            :messages="state.messages"
            :scroll-to-bottom-trigger="state.scrollToBottomTrigger"
            :emoji-panel-open="state.emojiPanelOpen"
            :chat-type="CHAT_TYPE.GROUP"
          />
        </keep-alive>
        <add-file-panel
          @close="state.addingFile = false"
          @trigger-file-picker="triggerFilePicker"
          @send-files="sendFiles"
          :files="state.files"
          v-if="state.addingFile"
        />
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
import { provide, defineComponent, reactive, onMounted, computed, ref } from "vue";
import { downloadURI, secondsToElapsedTime } from "src/utils/helpers";
import { MSG_TYPE, GROUP_CHAT_RIGHT_PANEL, CHAT_TYPE } from "src/utils/constants";
import { format } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";
import MessagePanel from "src/components/chat/MessagePanel.vue";
import GroupDetails from "src/components/chat/rightPanel/GroupDetails.vue";
import GroupChatSearch from "src/components/chat/rightPanel/GroupChatSearch.vue";
import EmojiPicker from "src/components/chat/EmojiPicker.vue";
import AddFilePanel from "src/components/AddFilePanel.vue";
import { useRoute } from "vue-router";
import ChatService from "src/services/chats";
import { useStore } from "vuex";
import { Notify } from "quasar";

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
    const store = useStore();
    const route = useRoute();

    // Plugins (provides and injects)
    const filePickerTrigger = ref(false);
    provide("filePickerTrigger", filePickerTrigger);

    const messageSelectMode = ref(false);
    provide("messageSelectMode", messageSelectMode);

    const state = reactive({
      loading: false,
      addingFile: false,
      messages: [],
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

    const mediaRecorderStopListener = async () => {
      if (!state.recordingCancelled) {
        await ChatService.sendAudioMessage(
          new Blob(state.recordedChunks),
          state.chatDetails.id,
          store.getters["user/user"].data.id
        );
        state.messages.push({
          userId: store.getters["user/user"].data.id,
          sent: true,
          sentAt: new Date(),
          type: MSG_TYPE.AUDIO,
          fileContent: URL.createObjectURL(new Blob(state.recordedChunks))
        });
        scrollToEndOfMsgContainer();
      }
    };

    const handleSuccess = async (stream) => {
      state.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      state.mediaRecorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) {
          state.recordedChunks.push(e.data);
        }
      });
      state.mediaRecorder.addEventListener("stop", mediaRecorderStopListener);
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

    const sendTxtMsg = async () => {
      if (state.msgText !== null && state.msgText !== "" && state.msgText.length > 4) {
        await ChatService.sendMessage({
          userId: store.getters["user/user"].data.id,
          type: MSG_TYPE.TXT,
          txt: state.msgText,
          chatId: state.chatDetails.id
        });
        state.messages.push({
          userId: store.getters["user/user"].data.id,
          sent: true,
          type: MSG_TYPE.TXT,
          txt: state.msgText,
          sentAt: new Date()
        });
        state.msgText = null;
        scrollToEndOfMsgContainer();
      }
    };

    const triggerFilePicker = () => {
      filePickerTrigger.value = !filePickerTrigger.value;
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

    const sendFiles = async () => {
      for (let i = 0; i < state.files.length; i++) {
        await ChatService.uploadFile(
          state.files[i],
          state.chatDetails.id,
          store.getters["user/user"].data.id
        );
        state.messages.push({
          userId: store.getters["user/user"].data.id,
          sent: true,
          type: MSG_TYPE.FILE,
          fileContent: state.files[i]
        });
      }
      scrollToEndOfMsgContainer();
    };

    const deleteMsg = async (id) => {
      await ChatService.deleteMessage(state.chatDetails.id, id);
    };

    onMounted(async () => {
      try {
        state.loading = true;
        const uid = route.params.id;
        state.chatDetails = await ChatService.getDetails(uid);
        state.messages = [
          ...state.chatDetails.messages.map((m) => ({
            ...m,
            sent: store.getters["user/user"].data.id === m.userId
          }))
        ];
        scrollToEndOfMsgContainer();
      } catch (e) {
        Notify.create({
          message: e.message,
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } finally {
        state.loading = false;
      }
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
      openEmojiPanel,
      sendFiles,
      deleteMsg,
      CHAT_TYPE,
      messageSelectMode
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

.chat-top-loading-bar {
  position: absolute;
  top: 56px;
}
</style>
