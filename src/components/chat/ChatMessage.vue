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
            {{ $t("yourBrowserDoesNotSupportTheAudioElement") }}.
          </audio>
        </div>
        <div
          v-else-if="message.type === MSG_TYPE.FILE"
          class="row q-pa-sm items-center justify-between"
        >
          <template v-if="getFileExtension(message.fileName) === 'gif'">
            <img
              @click="$emit('open-image-preview-dialog', message.fileUrl)"
              :src="message.fileUrl"
              class="gif-container cursor-pointer"
            />
          </template>
          <template v-else-if="fileIsType(message.fileName, [GENERALIZED_FILE_TYPES.VIDEO])">
            <video
              :style="{
                borderRadius: '8px'
              }"
              :width="message.portrait ? 195 : 275"
              :height="message.portrait ? 270 : 150"
              controls
            >
              <source :src="message.fileUrl" type="video/mp4" />
              {{ $t("yourBrowserDoesNotSupportTheVideoTag") }}.
            </video>
          </template>
          <template v-else-if="fileIsType(message.fileName, [GENERALIZED_FILE_TYPES.IMAGE])">
            <img
              @click="$emit('open-image-preview-dialog', message.fileUrl)"
              :src="message.fileUrl"
              class="img-container cursor-pointer"
            />
          </template>
          <template v-else>
            <div class="text-white">
              <q-icon color="white" size="30px" :name="getFileIcon(message.fileName)" />
              <span class="q-ml-sm">
                {{ message.fileName }}
              </span>
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
                <q-item clickable v-close-popup>
                  <q-item-section>
                    {{ $t("forwardMessage") }}
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    {{ $t("pinMessage") }}
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="deleteMsg"
                  v-if="message.username === currentUser"
                >
                  <q-item-section>
                    {{ $t("deleteMessage") }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject, computed, watch } from "vue";
import { MSG_TYPE, GENERALIZED_FILE_TYPES } from "src/utils/constants";
import {
  getFileIcon,
  getFileExtension,
  bytesToSize,
  downloadFile,
  getFileFromUrl,
  fileIsType
} from "src/utils/helpers";
import { useStore } from "vuex";

const emit = defineEmits(["selected", "delete-msg", "open-image-preview-dialog"]);

const props = defineProps({
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
});

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
            height = "360px";
          }
        } else {
          if (isGif) {
            maxWidth = "280px";
            height = "200px";
          } else if (isVideo) {
            maxWidth = "305px";
            height = "210px";
          } else {
            maxWidth = "505px";
            height = "175px";
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
  // const files = firebase.firestore().collection("/chats").doc(props.chatId).collection("files");
  const files = [];
  const fileData = await files.doc(props.message.fileId).get();
  const fileContent = await getFileFromUrl(props.message.fileUrl, fileData.data().name);
  downloadFile(fileContent);
};

const deleteMsg = () => {
  emit("delete-msg", props.message.id);
};

watch(
  () => messageSelectMode,
  (val) => {
    if (val === false) {
      state.selected = false;
    }
  }
);
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
  border-radius: 8px !important;
}

.img-container {
  width: 100%;
  border-radius: 8px !important;
}
</style>
