<template>
  <div
    @mouseover="state.showActions = true"
    @mouseleave="mouseLeaveMsg"
    class="row q-py-sm q-px-md msg q-my-xs"
    :class="`bg-${bgColor} text-${textColor}`"
  >
    <q-btn
      v-show="state.showActions"
      class="message-action-btn"
      size="sm"
      flat
      round
      icon="mdi-chevron-down"
    >
      <q-menu v-model="state.actionMenu" dark left>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="openRightPanel">
            <q-item-section>Reply</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Forward message</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Star message</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Delete message</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <div class="col-12 text-white">
      <span v-if="type === MSG_TYPE.TXT">
        {{ txt }}
      </span>
      <div v-else-if="type === MSG_TYPE.AUDIO">
        <audio controls>
          <source :src="audioContent" type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
    <div class="col-12 text-grey q-mt-xs">
      {{ sentAt }}
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { MSG_TYPE } from "src/utils/constants";

export default defineComponent({
  name: "chat-message",
  props: {
    type: {
      type: Number,
      required: true
    },
    audioContent: {
      type: Object,
      required: false
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
    }
  },
  setup() {
    const state = reactive({
      showActions: false,
      actionMenu: false
    });

    const mouseLeaveMsg = () => {
      state.showActions = false;
      state.actionMenu = false;
    };

    return {
      MSG_TYPE,
      state,
      mouseLeaveMsg
    };
  }
});
</script>

<style lang="scss" scoped>
.message-action-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.msg {
  border-radius: 6px;
  font-size: 12px;
}
</style>
