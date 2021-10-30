<template>
  <upload-overlay @change="filesUploaded" :file-picker-trigger="state.filePickerTrigger">
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
          <q-item clickable v-close-popup>
            <q-item-section>Contact info</q-item-section>
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
            <q-item-section>Delete chat</q-item-section>
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
          :select-mode="selectMode"
          :audio-content="message.audioContent"
          :txt="message.txt"
          sent-at="7 minutes ago"
          :bg-color="message.sent ? 'teal-9' : 'blue-grey-9'"
          text-color="white"
          class="chat-msg pos-rel"
          :type="message.type"
          :sent="message.sent"
          @selected="messageSelected"
        />
      </div>
    </q-scroll-area>
  </upload-overlay>
</template>

<script>
import { defineComponent, ref, reactive, nextTick, watch, computed } from "vue";
import { MSG_TYPE } from "src/utils/constants";
import ChatMessage from "./ChatMessage.vue";
import UploadOverlay from "../UploadOverlay.vue";

export default defineComponent({
  name: "message-panel",
  emits: ["should-show-scroll-to-bottom", "file-uploaded"],
  props: {
    messages: {
      type: Array,
      required: true
    },
    scrollToBottomTrigger: {
      type: Boolean,
      required: true
    },
    filePickerTrigger: {
      type: Boolean,
      required: false
    },
    emojiPanelOpen: {
      type: Boolean,
      required: false
    },
    selectMode: {
      type: Boolean,
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
      filePickerTrigger: false,
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
      emit("should-show-scroll-to-bottom", e.verticalPercentage < 0.3);
    };

    const filesUploaded = (files) => {
      emit("file-uploaded", files);
    };

    const messageSelected = () => {
      //
    };

    watch(
      () => props.scrollToBottomTrigger,
      () => scrollToEndOfMsgContainer()
    );

    watch(
      () => props.filePickerTrigger,
      () => (state.filePickerTrigger = !state.filePickerTrigger)
    );

    return {
      msgContainer,
      msgContainerScrollChanged,
      state,
      MSG_TYPE,
      filesUploaded,
      messageSelected
    };
  }
});
</script>

<style lang="scss" scoped>
.msg-container {
  position: relative;
}

.chat-msg {
  max-width: 85%;
}
</style>
