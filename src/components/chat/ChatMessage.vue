<template>
  <div class="row q-py-sm q-px-md msg q-my-xs" :class="`bg-${bgColor} text-${textColor}`">
    <div
      class="col-12 text-white full-width"
      :class="{
        'text-center': type === MSG_TYPE.AUDIO
      }"
    >
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
    <div class="col-12 text-grey q-mt-xs justify-between">
      <span>
        {{ sentAt }}
      </span>
      <q-btn size="xs" flat round icon="mdi-chevron-down">
        <q-menu dark left>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
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
      type: String,
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
    const state = reactive({});

    return {
      MSG_TYPE,
      state
    };
  }
});
</script>

<style lang="scss" scoped>
.msg {
  border-radius: 6px;
  font-size: 12px;
}
</style>
