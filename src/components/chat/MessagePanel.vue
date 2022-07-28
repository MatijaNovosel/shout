<template>
  <upload-overlay @change="filesUploaded">
    <q-scroll-area
      :thumb-style="{
        right: '2px',
        backgroundColor: '#97999c',
        width: '5px',
        opacity: 0.75
      }"
      class="msg-container row q-px-xl q-py-md"
      :style="state.msgContainerStyle"
      ref="msgContainer"
      @scroll="msgContainerScrollChanged"
      id="scroll-area"
    >
      <q-menu dark touch-position context-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="$emit('open-details')">
            <q-item-section>
              {{ chatType === CHAT_TYPE.GROUP ? "Group details" : "Contact info" }}
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="$emit('select-messages')">
            <q-item-section>
              {{ $t("selectMessages") }}
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>
              {{ $t("muteNotifications") }}
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>
              {{ chatType === CHAT_TYPE.GROUP ? "Leave group" : "Delete chat" }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <div
        :id="message.id"
        v-for="message in messages"
        :key="message.id"
        class="col-12 row pos-rel"
        :class="{
          'justify-end': message.sent,
          'justify-center q-my-sm': message.type === MSG_TYPE.INFO
        }"
      >
        <chat-message
          @selected="messageSelected"
          @delete-msg="deleteMsg"
          @open-image-preview-dialog="openImagePreviewDialog"
          :sent-at="formatSentAt(message)"
          :bg-color="formatBgColor(message)"
          :message="message"
          text-color="white"
        />
      </div>
    </q-scroll-area>
    <image-preview-dialog :src="state.dialogImageSrc" v-model="state.imagePreviewDialog" />
  </upload-overlay>
</template>

<script setup>
import { ref, reactive, nextTick, watch, computed } from "vue";
import { MSG_TYPE, CHAT_TYPE } from "src/utils/constants";
import ChatMessage from "./ChatMessage.vue";
import UploadOverlay from "../UploadOverlay.vue";
import ImagePreviewDialog from "../ImagePreviewDialog.vue";
import { format } from "date-fns";

const emit = defineEmits([
  "should-show-scroll-to-bottom",
  "file-uploaded",
  "delete-msg",
  "select-messages",
  "open-details",
  "trigger-pagination"
]);

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  scrollToBottomTrigger: {
    type: Boolean,
    required: true
  },
  emojiPanelOpen: {
    type: Boolean
  },
  chatType: {
    type: Number
  }
});

const msgContainer = ref(null);

const state = reactive({
  dialogImageSrc: null,
  imagePreviewDialog: false,
  msgContainerStyle: computed(() => {
    if (props.emojiPanelOpen === true) {
      return {
        maxHeight: "calc(100% - 316px)",
        height: "calc(100% - 316px)"
      };
    } else {
      return {
        maxHeight: "calc(100% - 116px)",
        height: "calc(100% - 116px)"
      };
    }
  })
});

const scrollToEndOfMsgContainer = () => {
  nextTick(() => {
    msgContainer.value.setScrollPosition("vertical", 9999);
  });
};

const msgContainerScrollChanged = (e) => {
  emit("should-show-scroll-to-bottom", e.verticalPercentage !== 0 && e.verticalPercentage <= 0.8);
};

const filesUploaded = (files) => {
  emit("file-uploaded", files);
};

const messageSelected = () => {
  //
};

const deleteMsg = (msgId) => {
  emit("delete-msg", msgId);
};

const formatSentAt = (msg) => {
  return format(msg.sentAt, "dd.MM.yyyy. HH:mm");
};

const formatBgColor = (msg) => {
  if (msg.type === MSG_TYPE.INFO) {
    return "blue-grey-9";
  }
  return msg.sent ? "orange-10" : "blue-grey-9";
};

const openImagePreviewDialog = (src) => {
  state.dialogImageSrc = src;
  state.imagePreviewDialog = true;
};

const scrollToMessage = (msgId) => {
  const el = document.getElementById(msgId);
  el.scrollIntoView();
};

watch(
  () => props.scrollToBottomTrigger,
  () => scrollToEndOfMsgContainer()
);
</script>

<style lang="scss" scoped>
.msg-container {
  position: relative;
}
</style>
