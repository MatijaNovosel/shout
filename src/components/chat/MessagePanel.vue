<template>
  <q-scroll-area
    :thumb-style="{
      right: '2px',
      backgroundColor: '#97999c',
      width: '5px',
      opacity: 0.75
    }"
    class="msg-container row q-px-xl q-py-md"
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
      class="col-12 row"
      :class="{
        'justify-end': message.sent
      }"
    >
      <q-chat-message
        :text="[message.txt]"
        stamp="7 minutes ago"
        :sent="message.sent"
        :bg-color="message.sent ? 'teal-9' : 'blue-grey-9'"
        text-color="white"
        class="chat-msg full-width"
      >
        <span v-if="message.type === MSG_TYPE.TXT">
          {{ message.txt }}
        </span>
        <div v-else-if="message.type === MSG_TYPE.AUDIO">
          <audio controls>
            <source :src="message.audioContent" type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </q-chat-message>
    </div>
  </q-scroll-area>
</template>

<script>
import { defineComponent, ref, reactive, nextTick, watch } from "vue";
import { MSG_TYPE } from "src/utils/constants";

export default defineComponent({
  name: "message-panel",
  emits: ["should-show-scroll-to-bottom"],
  props: {
    messages: {
      type: Array,
      required: true
    },
    scrollToBottomTrigger: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const msgContainer = ref(null);

    const state = reactive({
      shouldShowScrollToBottom: false
    });

    const scrollToEndOfMsgContainer = () => {
      nextTick(() => {
        msgContainer.value.setScrollPosition("vertical", 9999);
      });
    };

    const msgContainerScrollChanged = (e) => {
      emit("should-show-scroll-to-bottom", e.verticalPercentage < 0.3);
    };

    watch(
      () => props.scrollToBottomTrigger,
      () => scrollToEndOfMsgContainer()
    );

    return {
      msgContainer,
      msgContainerScrollChanged,
      state,
      MSG_TYPE
    };
  }
});
</script>

<style lang="scss" scoped>
.msg-container {
  position: relative;
  max-height: calc(100% - 116px);
  height: calc(100% - 116px);
}

.chat-msg {
  max-width: 85%;
}
</style>
