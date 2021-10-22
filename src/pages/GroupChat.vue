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
            <div class="column q-ml-md">
              <span> {{ groupDetails.name }} </span>
              <span> {{ groupDetails.users.map((u) => u.username).join(", ") }} </span>
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
          :emoji-panel-open="state.emojiPanelOpen"
        />
        <div class="emoji-panel" v-if="state.emojiPanelOpen">
          <emoji-picker />
        </div>
        <div class="bottom-bar q-py-sm q-px-md">
          <div class="bottom-bar-left">
            <q-btn
              flat
              round
              :color="state.emojiPanelOpen ? 'teal' : 'white'"
              icon="mdi-emoticon"
              @click="state.emojiPanelOpen = !state.emojiPanelOpen"
            />
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
            :style="state.fabStyle"
          />
        </div>
      </div>
    </div>
    <div class="col-4" v-show="state.rightPanelOpen">
      <keep-alive>
        <group-details
          v-if="state.activeRightPanel === GROUP_CHAT_RIGHT_PANEL.DETAILS"
          :group-details="groupDetails"
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
import { range, randInt, downloadURI } from "src/utils/helpers";
import { loremIpsum, MSG_TYPE, GROUP_CHAT_RIGHT_PANEL } from "src/utils/constants";
import { format } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";
import MessagePanel from "src/components/chat/MessagePanel.vue";
import GroupDetails from "src/components/chat/rightPanel/GroupDetails.vue";
import GroupChatSearch from "src/components/chat/rightPanel/GroupChatSearch.vue";
import UserService from "../services/users";
import EmojiPicker from "src/components/chat/EmojiPicker.vue";

export default defineComponent({
  name: "ChatDetails",
  components: {
    MessagePanel,
    GroupDetails,
    GroupChatSearch,
    EmojiPicker
  },
  setup() {
    const groupDetails = {
      name: "Group chat",
      createdAt: "19/10/2021 at 19:00",
      description: "Add group description",
      users: [
        {
          username: "You",
          status: "I will not go, prefer a feast of friends to the giant family"
        },
        {
          username: "User 1",
          status: "Status for user 1"
        },
        {
          username: "User 2",
          status: "Status for user 2"
        },
        {
          username: "User 3",
          status: "Status for user 3"
        }
      ]
    };

    // const users = useLoadUsers();

    const state = reactive({
      messages: [],
      recording: false,
      emojiPanelOpen: false,
      recordingCancelled: false,
      mediaRecorder: null,
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

    const openRightPanel = (rightPanel) => {
      state.activeRightPanel = rightPanel;
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
      const users = UserService.getAll();
      console.log(users);
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
      groupDetails,
      GROUP_CHAT_RIGHT_PANEL
      // users
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

.bottom-bar {
  background-color: #2a2f32;
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
