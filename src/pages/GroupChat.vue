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
          <div class="row text-white q-pl-md">
            <q-avatar
              class="cursor-pointer"
              size="40px"
              v-if="state.chatDetails && !state.loading"
              @click="openRightPanel(GROUP_CHAT_RIGHT_PANEL.DETAILS)"
            >
              <img :src="state.chatDetails.avatar" />
              <q-tooltip>
                {{ $t("groupDetails") }}
              </q-tooltip>
            </q-avatar>
            <div class="column q-ml-md justify-center" v-if="!state.loading">
              <template v-if="state.chatDetails">
                <span> {{ state.chatDetails.name }} </span>
                <span class="text-grey-6">
                  {{ state.formatGroupSubtitle }}
                </span>
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
            >
              <q-tooltip> {{ $t("searchMessages") }} </q-tooltip>
            </q-btn>
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
                      <q-item-label> {{ $t("you") }} </q-item-label>
                      <q-item-label caption class="text-grey"> Message test </q-item-label>
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
                      <q-item-label> {{ $t("you") }} </q-item-label>
                      <q-item-label caption class="text-grey"> Message test 2 </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-tooltip> {{ $t("pinnedMessages") }} </q-tooltip>
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
              <q-tooltip> {{ $t("textChannels") }} </q-tooltip>
            </q-btn>
            <q-btn flat round color="white" icon="mdi-dots-vertical">
              <q-menu dark left>
                <q-list dense style="min-width: 100px">
                  <q-item
                    clickable
                    v-close-popup
                    @click="openRightPanel(GROUP_CHAT_RIGHT_PANEL.DETAILS)"
                  >
                    <q-item-section>
                      {{ $t("groupInfo") }}
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="messageSelectMode = !messageSelectMode">
                    <q-item-section>
                      {{ $t("selectMessages") }}
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      {{ $t("muteNotifications") }}
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="leaveGroup">
                    <q-item-section>
                      {{ $t("exitGroup") }}
                    </q-item-section>
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
            ref="messagePanel"
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
              :color="state.emojiPanelOpen ? 'orange' : 'white'"
              icon="mdi-emoticon"
              @click="openEmojiPanel"
            >
              <q-tooltip top> {{ $t("emojiPicker") }} </q-tooltip>
            </q-btn>
          </div>
          <div class="bottom-bar-center">
            <q-input
              dark
              dense
              rounded
              standout
              :placeholder="$t('typeAMessage')"
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
              >
                <q-tooltip top>
                  {{ $t("recordAudioMessage") }}
                </q-tooltip>
              </q-btn>
              <template v-else>
                <q-btn flat round color="red" icon="mdi-close-circle" @click="stopRecording(true)">
                  <q-tooltip top>
                    {{ $t("cancelRecording") }}
                  </q-tooltip>
                </q-btn>
                <span class="text-white">
                  {{ elapsedRecordingSecondsFormatted }}
                </span>
                <q-btn
                  flat
                  round
                  color="green"
                  icon="mdi-check-circle-outline"
                  @click="stopRecording(false)"
                >
                  <q-tooltip top>
                    {{ $t("stopRecording") }}
                  </q-tooltip>
                </q-btn>
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
          :uploading-pfp="state.uploadingPfp"
          @close="state.rightPanelOpen = false"
          @open-avatar-editor="state.avatarEditorDialog = true"
        />
      </keep-alive>
      <keep-alive>
        <group-chat-search
          v-if="state.activeRightPanel === GROUP_CHAT_RIGHT_PANEL.SEARCH"
          :messages="state.messages"
          @close="state.rightPanelOpen = false"
          @scroll-to-message="scrollToMessage"
        />
      </keep-alive>
    </div>
  </div>
  <avatar-editor-dialog
    @save="uploadGroupPfp"
    v-model="state.avatarEditorDialog"
    :initial-image="state.chatDetails.avatar"
    v-if="state.chatDetails"
  />
</template>

<script setup>
import { provide, reactive, onMounted, computed, ref, onUnmounted, watch } from "vue";
import { downloadURI, secondsToElapsedTime } from "src/utils/helpers";
import {
  MSG_TYPE,
  GROUP_CHAT_RIGHT_PANEL,
  CHAT_TYPE,
  GROUP_CHANGE_TYPE
} from "src/utils/constants";
import { format, isAfter } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";
import MessagePanel from "src/components/chat/MessagePanel.vue";
import GroupDetails from "src/components/chat/rightPanel/GroupDetails.vue";
import GroupChatSearch from "src/components/chat/rightPanel/GroupChatSearch.vue";
import EmojiPicker from "src/components/chat/EmojiPicker.vue";
import AddFilePanel from "src/components/AddFilePanel.vue";
import { useRoute, useRouter } from "vue-router";
import ChatService from "src/services/chats";
import { useStore } from "vuex";
import { Notify, useQuasar } from "quasar";
import AvatarEditorDialog from "src/components/avatarEditor/AvatarEditorDialog.vue";
import { useI18n } from "vue-i18n";

const store = useStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const messagePanel = ref(null);

// Plugins (provides and injects)
const filePickerTrigger = ref(false);
provide("filePickerTrigger", filePickerTrigger);

const messageSelectMode = ref(false);
provide("messageSelectMode", messageSelectMode);

const state = reactive({
  uploadingFiles: false,
  loadedAt: new Date(),
  loading: false,
  uploadingPfp: false,
  addingFile: false,
  avatarEditorDialog: false,
  messages: [],
  files: [],
  elapsedRecordingSeconds: 0,
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
  }),
  formatGroupSubtitle: computed(() => {
    if (state.chatDetails) {
      let txt = state.chatDetails.users.map((u) => u.username).join(", ");
      if (state.chatDetails.users.length > 3) {
        txt += t("andOthers");
      }
      return txt;
    }
    return "";
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
      store.getters["user/user"].id
    );
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
  if (
    state.msgText !== null &&
    state.msgText !== "" &&
    state.msgText.length > 2 &&
    state.msgText.length <= 256
  ) {
    try {
      await ChatService.sendMessage({
        userId: store.getters["user/user"].id,
        type: MSG_TYPE.TXT,
        txt: state.msgText,
        chatId: state.chatDetails.id
      });
    } catch (e) {
      Notify.create({
        message: e.message,
        position: "top",
        color: "dark",
        textColor: "orange"
      });
    } finally {
      state.msgText = null;
    }
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
  try {
    $q.loading.show({
      message: t("uploadingFiles")
    });
    for (let i = 0; i < state.files.length; i++) {
      await ChatService.uploadFile(
        state.files[i],
        state.chatDetails.id,
        store.getters["user/user"].id
      );
    }
  } catch (e) {
    Notify.create({
      message: e.message,
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  } finally {
    $q.loading.hide();
  }
};

const deleteMsg = async (id) => {
  try {
    await ChatService.deleteMessage(state.chatDetails.id, id);
    Notify.create({
      message: t("deleteMsgSuccess"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  } catch (e) {
    Notify.create({
      message: t("deleteMsgFailure"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  }
};

const uploadGroupPfp = async (imgFile) => {
  try {
    state.uploadingPfp = true;
    const url = await ChatService.changeGroupProfilePicture(imgFile, state.chatDetails.id);
    await ChatService.sendInfoMessage({
      userId: store.getters["user/user"].id,
      type: MSG_TYPE.INFO,
      txt: `<span class="info-date">[${format(
        new Date(),
        "dd.MM.yyyy. HH:mm"
      )}]</span> Group profile picture was updated`,
      chatId: state.chatDetails.id
    });
    await store.dispatch("chats/updateChatAvatar", {
      chatId: state.chatDetails.id,
      url
    });
    state.chatDetails.avatar = url;
    Notify.create({
      message: t("updateGroupProfilePictureSuccess"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  } catch (e) {
    Notify.create({
      message: t("updateGroupProfilePictureFailure"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  } finally {
    state.uploadingPfp = false;
  }
};

const handleEnter = (e) => {
  if (e.keyCode === 13) {
    sendTxtMsg();
  }
};

const processMessages = async (messages) => {
  if (store.getters["user/user"]) {
    const userId = store.getters["user/user"].id;

    for (let i = 0; i < messages.length; i++) {
      const sent = userId === messages[i].userId;
      const sentAt = new Date(messages[i].sentAt.seconds * 1000);

      /*
      const files = firebase
        .firestore()
        .collection("/chats")
        .doc(state.chatDetails.id)
        .collection("files");
      */

      const files = [];

      let username = "";

      if (messages[i].userId === userId) {
        username = `${store.getters["user/user"].username}#${store.getters["user/user"].shorthandId}`;
      } else {
        // const user = await firebase.firestore().collection("/users").doc(messages[i].userId).get();
        const user = {};
        username = `${user.data().username}#${user.data().shorthandId}`;
      }

      if (messages[i].type === MSG_TYPE.FILE || messages[i].type === MSG_TYPE.AUDIO) {
        // const file = firebase.storage().ref(messages[i].fileId);
        const file = {};
        const fileUrl = await file.getDownloadURL();

        const fileInfo = await files.doc(messages[i].fileId).get();

        state.messages.push({
          id: messages[i].id,
          userId,
          sent,
          sentAt,
          type: messages[i].type,
          fileUrl,
          chatId: state.chatDetails.id,
          fileId: messages[i].fileId,
          fileName: fileInfo.data().name,
          fileSize: fileInfo.data().size,
          username,
          portrait: messages[i].portrait
        });
      } else {
        state.messages.push({
          id: messages[i].id,
          userId,
          sent,
          sentAt,
          type: messages[i].type,
          txt: messages[i].txt,
          username
        });
      }

      if (sent) {
        scrollToEndOfMsgContainer();
      }
    }
  }
};

const leaveGroup = async () => {
  try {
    await ChatService.leaveGroup(
      {
        id: store.getters["user/user"].id,
        username: `${store.getters["user/user"].username}#${store.getters["user/user"].shorthandId}`
      },
      state.chatDetails.id
    );
    Notify.create({
      message: t("youHaveLeftTheGroup"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
    router.push({
      name: ROUTE_NAMES.HOME
    });
  } catch (e) {
    Notify.create({
      message: t("failedToLeaveGroup"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  }
};

const removeMessage = (id) => {
  state.messages = state.messages.filter((msg) => msg.id !== id);
};

const scrollToMessage = (msgId) => {
  messagePanel.value.scrollToMessage(msgId);
};

const elapsedRecordingSecondsFormatted = computed(() => {
  const { m, s } = secondsToElapsedTime(state.elapsedRecordingSeconds);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
});

const loadMessages = async (first) => {
  document.addEventListener("keyup", handleEnter);

  try {
    state.loading = true;
    const uid = route.params.id;
    state.chatDetails = await ChatService.getDetails(uid);
    const { messages } = await ChatService.getGroupChatMessages(uid);
    messages
      .map((m) => ({
        ...m,
        sent: store.getters["user/user"].id === m.userId
      }))
      .forEach((msg) => {
        if (first) {
          state.messages.push(msg);
        } else {
          state.messages.unshift(msg);
        }
      });
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

    // Message socket
    /*
    firebase
      .firestore()
      .collection("/chats")
      .doc(state.chatDetails.id)
      .collection("/messages")
      .onSnapshot(async (querySnapshot) => {
        const messages = [];

        querySnapshot.docChanges().forEach((doc) => {
          if (doc.type === "removed") {
            removeMessage(doc.doc.id);
          }
        });

        querySnapshot.forEach(async (doc) => {
          if (
            isAfter(new Date(doc.data().sentAt.seconds * 1000), state.loadedAt) &&
            state.messages.filter((msg) => msg.id === doc.id).length === 0
          ) {
            messages.push({ id: doc.id, ...doc.data() });
          }
        });

        if (messages.length !== 0) {
          processMessages(messages);
        }
      });
    */

    // Group changes socket
    /*
    firebase
      .firestore()
      .collection("/chats")
      .doc(state.chatDetails.id)
      .onSnapshot(async (querySnapshot) => {
        const data = querySnapshot.data();
        if (isAfter(new Date(data.lastChangedAt.seconds * 1000), state.loadedAt)) {
          if (data.changeType) {
            switch (data.changeType) {
              case GROUP_CHANGE_TYPE.AVATAR:
                state.chatDetails.avatar = data.avatar;
                break;
              case GROUP_CHANGE_TYPE.DESCRIPTION:
                state.chatDetails.description = data.description;
                break;
              case GROUP_CHANGE_TYPE.NAME:
                state.chatDetails.name = data.name;
                break;
            }
          }
        }
      });
      */
  }
};

onMounted(async () => {
  await loadMessages(true);
});

onUnmounted(() => {
  document.removeEventListener("keyup", handleEnter);
});

watch(
  () => route.params,
  async () => {
    state.messages = [];
    await loadMessages(true);
    document.removeEventListener("keyup", handleEnter);
  }
);
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
