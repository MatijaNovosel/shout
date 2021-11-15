<template>
  <div class="row q-py-sm q-px-md msg q-my-xs" :class="`bg-${bgColor} text-${textColor}`">
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
          'text-center': type === MSG_TYPE.AUDIO,
          'bg-teal-10 rounded-borders': type === MSG_TYPE.FILE && sent,
          'bg-blue-grey-10 rounded-borders': type === MSG_TYPE.FILE && !sent
        }"
      >
        <span v-if="type === MSG_TYPE.TXT">
          {{ txt }}
        </span>
        <div v-else-if="type === MSG_TYPE.AUDIO">
          <audio controls>
            <source :src="fileUrl" type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <div v-else-if="type === MSG_TYPE.FILE" class="row justify-between q-pa-sm items-center">
          <div>
            <div class="text-white">
              <q-icon color="white" size="30px" :name="getFileIcon(fileName)" />
              <span class="q-ml-sm">
                {{ fileName }}
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
        </div>
      </div>
      <div
        class="col-12 text-grey q-mt-xs row"
        :class="{ 'justify-between q-mt-sm': type === MSG_TYPE.FILE }"
      >
        <span v-if="type === MSG_TYPE.FILE">
          {{ `${getFileExtension(fileName)} • ${bytesToSize(fileSize)}` }}
        </span>
        <div>
          <span class="q-mr-sm">
            {{ sentAt }}
          </span>
          <q-btn size="xs" flat round icon="mdi-chevron-down">
            <q-menu dark left>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup v-if="!sent">
                  <q-item-section>Reply</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Forward message</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Pin message</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="deleteMsg">
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
import { defineComponent, reactive, inject } from "vue";
import { MSG_TYPE } from "src/utils/constants";
import {
  getFileIcon,
  getFileExtension,
  bytesToSize,
  downloadFile,
  getFileFromUrl
} from "src/utils/helpers";
import { firebase } from "src/boot/firebase";

export default defineComponent({
  name: "chat-message",
  emits: ["selected", "delete-msg"],
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    txt: {
      type: String,
      required: false
    },
    sentAt: {
      type: String,
      required: true
    },
    textColor: {
      type: String,
      required: true
    },
    bgColor: {
      type: String,
      required: true
    },
    sent: {
      type: Boolean,
      required: true
    },
    fileUrl: {
      type: String,
      required: false
    },
    fileId: {
      type: String,
      required: false
    },
    chatId: {
      type: String,
      required: false
    },
    fileName: {
      type: String,
      required: false
    },
    fileSize: {
      type: Number,
      required: false
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      selected: false
    });

    const messageSelectMode = inject("messageSelectMode");

    const messageSelected = () => {
      emit("selected");
    };

    const download = async () => {
      const files = firebase.firestore().collection("/chats").doc(props.chatId).collection("files");
      const fileData = await files.doc(props.fileId).get();
      const fileContent = await getFileFromUrl(props.fileUrl, fileData.data().name);
      downloadFile(fileContent);
    };

    const deleteMsg = () => {
      emit("delete-msg", props.id);
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
      deleteMsg
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
</style>
