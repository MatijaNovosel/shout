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
    >
      <q-menu dark touch-position context-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="$emit('open-details')">
            <q-item-section>
              {{ chatType === CHAT_TYPE.GROUP ? "Group details" : "Contact info" }}
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="$emit('select-messages')">
            <q-item-section>Select messages</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Mute notifications</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>
              {{ chatType === CHAT_TYPE.GROUP ? "Leave group" : "Delete chat" }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <div
        v-for="message in messages"
        :key="message.id"
        class="col-12 row pos-rel"
        :class="{
          'justify-end': message.sent
        }"
      >
        <chat-message
          @selected="messageSelected"
          @delete-msg="deleteMsg"
          :id="message.id"
          :txt="message.txt"
          :sent-at="formatSentAt(message)"
          :bg-color="message.sent ? 'teal-9' : 'blue-grey-9'"
          :type="message.type"
          :sent="message.sent"
          :file-url="message.fileUrl"
          :file-id="message.fileId"
          :file-size="message.fileSize"
          :file-name="message.fileName"
          :chat-id="message.chatId"
          text-color="white"
          class="pos-rel"
          :style="{
            maxWidth: '85%',
            width: message.type === MSG_TYPE.AUDIO && '33%'
          }"
        />
      </div>
    </q-scroll-area>
  </upload-overlay>
</template>

<script>
import { defineComponent, ref, reactive, nextTick, watch, computed } from "vue";
import { MSG_TYPE, CHAT_TYPE } from "src/utils/constants";
import ChatMessage from "./ChatMessage.vue";
import UploadOverlay from "../UploadOverlay.vue";
import { format } from "date-fns";

export default defineComponent({
  name: "message-panel",
  emits: [
    "should-show-scroll-to-bottom",
    "file-uploaded",
    "delete-msg",
    "select-messages",
    "open-details"
  ],
  props: {
    messages: {
      type: Array,
      required: true
    },
    scrollToBottomTrigger: {
      type: Boolean,
      required: true
    },
    emojiPanelOpen: {
      type: Boolean,
      required: false
    },
    chatType: {
      type: Number,
      required: false
    }
  },
  components: {
    ChatMessage,
    UploadOverlay
  },
  setup(props, { emit }) {
    const msgContainer = ref(null);

    const state = reactive({
      shouldShowScrollToBottom: false,
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
      emit(
        "should-show-scroll-to-bottom",
        e.verticalPercentage !== 0 && e.verticalPercentage < 0.3
      );
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

    watch(
      () => props.scrollToBottomTrigger,
      () => scrollToEndOfMsgContainer()
    );

    return {
      msgContainer,
      msgContainerScrollChanged,
      state,
      MSG_TYPE,
      filesUploaded,
      messageSelected,
      deleteMsg,
      formatSentAt,
      CHAT_TYPE
    };
  }
});
</script>

<style lang="scss" scoped>
.msg-container {
  position: relative;
}
</style>
