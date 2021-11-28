<template>
  <div
    v-if="message.type !== MSG_TYPE.INFO && !message.sent"
    class="text-orange col-12 message-author text-left"
  >
    {{ message.username }}
  </div>
  <div
    class="q-py-sm q-px-md msg q-my-xs"
    :class="`bg-${bgColor} text-${textColor}`"
    :style="{
      maxWidth: '85%'
    }"
    v-if="message.type === MSG_TYPE.INFO"
  >
    <span v-html="message.txt" />
  </div>
  <div
    class="row q-pt-sm q-px-sm msg q-my-xs"
    :class="`bg-${bgColor} text-${textColor}`"
    :style="state.messageStyle"
    v-else
  >
    <div class="row col-2 d-flex justify-center items-center align-center" v-if="messageSelectMode">
      <q-checkbox size="xs" @change="messageSelected" v-model="state.selected" />
    </div>
    <div
      class="row"
      :class="{
        'col-12': !messageSelectMode,
        'col-10': messageSelectMode
      }"
    >
      <div
        class="col-12 text-white full-width"
        :class="{
          'text-center': message.type === MSG_TYPE.AUDIO,
          'bg-dark-orange-10 rounded-borders': message.sent && message.type !== MSG_TYPE.AUDIO,
          'bg-blue-grey-10 rounded-borders': !message.sent && message.type !== MSG_TYPE.AUDIO,
          'q-pa-sm': message.type === MSG_TYPE.TXT
        }"
      >
        <span v-if="message.type === MSG_TYPE.TXT">
          {{ message.txt }}
        </span>
        <div v-else-if="message.type === MSG_TYPE.AUDIO">
          <audio controls>
            <source :src="message.fileUrl" type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <div
          v-else-if="message.type === MSG_TYPE.FILE"
          class="row justify-between q-pa-sm items-center"
        >
          <template v-if="getFileExtension(message.fileName) === 'gif'">
            <img :src="message.fileUrl" class="gif-container" />
          </template>
          <template v-else-if="fileIsType(message.fileName, [GENERALIZED_FILE_TYPES.VIDEO])">
            <video
              :style="{
                borderRadius: '8px'
              }"
              :width="message.portrait ? 195 : 260"
              :height="message.portrait ? 270 : 140"
              controls
            >
              <source :src="message.fileUrl" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </template>
          <template v-else-if="fileIsType(message.fileName, [GENERALIZED_FILE_TYPES.IMAGE])">
            <img :src="message.fileUrl" class="img-container" />
          </template>
          <template v-else>
            <div>
              <div class="text-white">
                <q-icon color="white" size="30px" :name="getFileIcon(message.fileName)" />
                <span class="q-ml-sm">
                  {{ message.fileName }}
                </span>
              </div>
            </div>
            <q-btn
              @click="download"
              color="grey-10"
              round
              icon="mdi-download"
              size="10px"
              class="q-mr-sm"
            />
          </template>
        </div>
      </div>
      <div
        class="col-12 text-white q-mt-xs row"
        :class="{ 'justify-between q-mt-sm': message.type === MSG_TYPE.FILE }"
      >
        <span v-if="message.type === MSG_TYPE.FILE">
          {{ `${getFileExtension(message.fileName)} • ${bytesToSize(message.fileSize)}` }}
        </span>
        <div>
          <span class="q-mr-sm">
            {{ sentAt }}
          </span>
          <q-btn size="xs" flat round icon="mdi-chevron-down">
            <q-menu dark left>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup v-if="!message.sent">
                  <q-item-section>Reply</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Forward message</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Pin message</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="deleteMsg"
                  v-if="message.username === currentUser"
                >
                  <q-item-section>Delete message</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, inject, computed } from "vue";
import { MSG_TYPE, GENERALIZED_FILE_TYPES } from "src/utils/constants";
import {
  getFileIcon,
  getFileExtension,
  bytesToSize,
  downloadFile,
  getFileFromUrl,
  fileIsType
} from "src/utils/helpers";
import { firebase } from "src/boot/firebase";
import { useStore } from "vuex";

export default defineComponent({
  name: "chat-message",
  emits: ["selected", "delete-msg"],
  props: {
    message: {
      type: Object
    },
    sentAt: {
      type: String
    },
    textColor: {
      type: String
    },
    bgColor: {
      type: String
    }
  },
  setup(props, { emit }) {
    const store = useStore();

    const state = reactive({
      selected: false,
      messageStyle: computed(() => {
        let width = "";
        let maxWidth = "85%";
        let height = "";

        if (props.message.type === MSG_TYPE.AUDIO) {
          width = "33%";
        } else if (props.message.type === MSG_TYPE.FILE) {
          const isGif = getFileExtension(props.message.fileName) === "gif";
          const isImage = fileIsType(props.message.fileName, [GENERALIZED_FILE_TYPES.IMAGE]);
          const isVideo = fileIsType(props.message.fileName, [GENERALIZED_FILE_TYPES.VIDEO]);
          if (isGif || isVideo || isImage) {
            if (props.message.portrait) {
              if (isGif) {
                maxWidth = "175px";
                height = "330px";
              } else if (isVideo) {
                maxWidth = "225px";
                height = "330px";
              } else {
                maxWidth = "255px";
                height = "310px";
              }
            } else {
              if (isGif) {
                maxWidth = "280px";
                height = "200px";
              } else if (isVideo) {
                maxWidth = "275px";
                height = "220px";
              } else {
                maxWidth = "505px";
                height = "200px";
              }
            }
          } else {
            width = "40%";
          }
        }

        return {
          maxWidth,
          width,
          height
        };
      })
    });

    const messageSelectMode = inject("messageSelectMode");

    const messageSelected = () => {
      emit("selected");
    };

    const download = async () => {
      const files = firebase.firestore().collection("/chats").doc(props.chatId).collection("files");
      const fileData = await files.doc(props.message.fileId).get();
      const fileContent = await getFileFromUrl(props.message.fileUrl, fileData.data().name);
      downloadFile(fileContent);
    };

    const deleteMsg = () => {
      emit("delete-msg", props.message.id);
    };

    return {
      MSG_TYPE,
      state,
      messageSelected,
      messageSelectMode,
      getFileIcon,
      getFileExtension,
      bytesToSize,
      download,
      deleteMsg,
      currentUser: `${store.getters["user/user"].username}#${store.getters["user/user"].shorthandId}`,
      fileIsType,
      GENERALIZED_FILE_TYPES
    };
  }
});
</script>

<style lang="scss" scoped>
.msg {
  border-radius: 6px;
  font-size: 12px;
}

audio {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
}

.message-author {
  font-size: 12px;
}

.gif-container {
  width: 100%;
  object-fit: cover;
  border-radius: 8px !important;
}

.img-container {
  width: 100%;
  object-fit: cover;
  border-radius: 8px !important;
}
</style>
